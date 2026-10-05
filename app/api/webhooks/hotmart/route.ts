import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
import { verifyHotmart } from '@/lib/hotmart-verify';
import { statusForEvent, PLAN_CHANGE_EVENT } from '@/lib/membership-fsm';

// Webhook de pagos (18-VENTA-HOTMART.md): el endpoint más atacado de la app. Las 4 defensas,
// en orden, antes de tocar la base de datos: autenticidad → frescura → idempotencia → FSM.
export const runtime = 'nodejs'; // necesita node:crypto y el raw body — no Edge

// Creado DENTRO de una función (no al cargar el módulo): así Next puede recolectar la
// configuración de la ruta en build/deploy aunque las variables de entorno todavía no estén
// puestas en Vercel — la conexión real solo se arma cuando llega una petición de verdad.
// Quita espacios/saltos de línea y comillas que a veces se cuelan al pegar un valor copiado
// de un .env en el panel de Vercel (VAR="valor") — un error muy común que rompe la conexión.
function limpiarEnv(v: string | undefined): string {
  return (v ?? '').trim().replace(/^["']|["']$/g, '');
}

function adminClient() {
  return createClient(
    limpiarEnv(process.env.SUPABASE_URL),
    limpiarEnv(process.env.SUPABASE_SECRET_KEY), // clave secreta: SOLO servidor, jamás NEXT_PUBLIC_
    { auth: { persistSession: false } }
  );
}

type Admin = ReturnType<typeof adminClient>;

/** Escribe en webhook_log y, si falla, lo deja en los logs del servidor (sin PII) — el
 * registro es la fuente de observabilidad del panel de administración, no puede fallar mudo. */
async function logWebhook(admin: Admin, row: { event_id?: string; type?: string; result: string }) {
  const { error } = await admin.from('webhook_log').insert(row);
  if (error) console.error('webhook_log insert falló', { code: error.code, message: error.message });
}

const REPLAY_WINDOW_MS = 5 * 60 * 1000;

function isFresh(ts?: number): boolean {
  if (!ts) return true; // sin fecha fiable en el payload, no bloquear solo por esto
  const age = Date.now() - ts;
  return age >= 0 && age <= REPLAY_WINDOW_MS;
}

/** Patrón A (18): asegura que exista la cuenta de auth ANTES de tocar el estado de la
 * suscripción — así profiles.id nunca necesita ser nulo. Reutiliza la fila que ya creó el
 * trigger handle_new_user si la cuenta ya existía. */
async function resolverPerfil(admin: Admin, email: string, name: string): Promise<string | null> {
  const { data: existente } = await admin.from('profiles').select('id').eq('email', email).maybeSingle();
  if (existente?.id) return existente.id as string;

  const { data: creado, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true, // passwordless: la cuenta se confirma con la compra, no con password
    user_metadata: { name },
  });
  if (!error && creado.user) return creado.user.id;
  // Sin PII: solo el código/mensaje del error de Supabase Auth (para diagnosticar por qué no se creó).
  console.error('createUser falló', { code: error?.code, status: error?.status, message: error?.message });

  // Carrera real: Hotmart manda varios eventos de la misma compra casi a la vez (aprobada,
  // completa…). Uno crea la cuenta; los demás fallan al crearla y deben ESPERAR a que el
  // trigger handle_new_user termine de escribir el perfil, no rendirse al primer intento.
  for (let intento = 0; intento < 6; intento++) {
    await new Promise((r) => setTimeout(r, 400));
    const { data: reintento } = await admin.from('profiles').select('id').eq('email', email).maybeSingle();
    if (reintento?.id) return reintento.id as string;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const admin = adminClient();

  // 1. RAW body — se lee antes de parsear (necesario si algún día hay firma documentada
  //    por Hotmart, y para el hash de auditoría).
  const rawBody = await req.text();

  // 2. Autenticidad — hottok en tiempo constante, sobre HTTPS.
  const hottok = req.headers.get('x-hotmart-hottok') ?? undefined;
  if (!verifyHotmart({ hottok })) {
    await logWebhook(admin, { result: 'unauthorized' });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // 3. Parsear SOLO después de verificar.
  let payload: Record<string, any>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  // 4. Frescura (anti-replay).
  const ts = payload.creation_date ?? payload.data?.purchase?.approved_date;
  if (!isFresh(ts)) {
    return NextResponse.json({ error: 'stale' }, { status: 400 });
  }

  const event: string = payload.event;
  const eventId: string =
    payload.id ?? payload.event_id ?? payload.data?.purchase?.transaction ?? `${event}:${payload.data?.buyer?.email}:${ts ?? ''}`;
  const email: string | undefined = payload.data?.buyer?.email ?? payload.email;
  const name: string = payload.data?.buyer?.name ?? '';
  const plan: string | undefined = /anual|yearly|annual/i.test(payload.data?.subscription?.plan?.name ?? '')
    ? 'anual'
    : /mensal|mensual|monthly/i.test(payload.data?.subscription?.plan?.name ?? '')
      ? 'mensual'
      : undefined;
  const subscriberCode: string | undefined = payload.data?.subscription?.subscriber?.code;

  if (event === PLAN_CHANGE_EVENT) {
    // SWITCH_PLAN no transiciona el status — solo actualiza plan/límites. Se deja preparado
    // para cuando la usuaria habilite "cambio de planes" en el panel del producto; hoy no
    // hay upgrade/downgrade nativo activo, así que no hay payload real para mapearlo todavía.
    return NextResponse.json({ received: true, ignored: event });
  }

  const newStatus = statusForEvent(event);
  if (!newStatus) return NextResponse.json({ received: true, ignored: event }); // evento que no nos interesa, 200

  if (!email) {
    await logWebhook(admin, { event_id: eventId, type: event, result: 'error' });
    return NextResponse.json({ error: 'missing email' }, { status: 400 });
  }

  const profileId = await resolverPerfil(admin, email, name);
  if (!profileId) {
    console.error('hotmart webhook: no se pudo resolver/crear el perfil', { event }); // sin PII
    await logWebhook(admin, { event_id: eventId, type: event, result: 'error' });
    return NextResponse.json({ error: 'processing failed' }, { status: 500 }); // 5xx → Hotmart reintenta
  }

  const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');
  const accessUntil = newStatus === 'cancelled' ? (payload.data?.subscription?.date_next_charge ?? null) : null;
  const graceEndsAt = newStatus === 'past_due' ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() : null;

  const { data, error } = await admin.rpc('apply_hotmart_event', {
    p_event_id: eventId,
    p_event_type: event,
    p_payload_hash: payloadHash,
    p_profile_id: profileId,
    p_name: name || null,
    p_plan: plan ?? null,
    p_subscriber_code: subscriberCode ?? null,
    p_new_status: newStatus,
    p_access_until: accessUntil,
    p_grace_ends_at: graceEndsAt,
  });

  if (error) {
    console.error('hotmart webhook error', { event, code: error.code }); // sin PII
    await logWebhook(admin, { event_id: eventId, type: event, result: 'error' });
    return NextResponse.json({ error: 'processing failed' }, { status: 500 });
  }

  if (data?.status === 'error') {
    // La RPC no pudo aplicar el cambio (p. ej. perfil no encontrado) — NO es un éxito: 5xx para que
    // Hotmart reintente (la RPC no marca el evento como procesado cuando falla por esto).
    console.error('hotmart webhook: la RPC reportó error', { event, reason: data?.reason });
    await logWebhook(admin, { event_id: eventId, type: event, result: 'error' });
    return NextResponse.json({ error: 'processing failed' }, { status: 500 });
  }

  const result: 'applied' | 'duplicate' | 'illegal' =
    data?.status === 'duplicate' ? 'duplicate' : data?.status === 'illegal_transition' ? 'illegal' : 'applied';
  await logWebhook(admin, { event_id: eventId, type: event, result });

  if (result === 'applied' && (newStatus === 'trialing' || newStatus === 'active')) {
    // El acceso ya quedó activo en la base de datos. El correo de bienvenida con el enlace
    // mágico se envía con Resend (pendiente de conectar, ver ESTADO.md) — hasta entonces, la
    // compradora entra por /login con el mismo correo con el que compró (texto de la clase de
    // acceso de Hotmart, 18 → "Paso B").
  }

  // Siempre 200 cuando la decisión ya se tomó (incluido duplicate/illegal): Hotmart deja de reintentar.
  return NextResponse.json({ received: true, result: data?.status ?? 'ok' });
}
