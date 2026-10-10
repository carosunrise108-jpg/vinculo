import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdmin } from '@supabase/supabase-js';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { tieneAcceso, type PerfilAcceso } from '@/lib/membership-fsm';
import { PRACTICAS } from '@/lib/practicas';

// Entrega la URL firmada (temporal) de un audio del bucket PRIVADO `practicas`, SOLO a quien tiene
// sesión y suscripción vigente — verificado aquí en el servidor, no en la pantalla. Sin esta ruta
// nadie puede escuchar los audios: el bucket no tiene ninguna política pública ni de cliente.
export const runtime = 'nodejs';

const CLAVES_VALIDAS = new Set(PRACTICAS.flatMap((p) => p.audios.map((a) => a.clave)));
const SEGUNDOS_URL = 60 * 60; // una hora alcanza para escuchar un audio completo

function limpiarEnv(v: string | undefined): string {
  return (v ?? '').trim().replace(/^["']|["']$/g, '');
}

export async function GET(req: NextRequest) {
  const clave = req.nextUrl.searchParams.get('clave') ?? '';
  // Lista cerrada: la clave del audio nunca se usa como ruta libre (evita path traversal / lectura de otros archivos).
  if (!CLAVES_VALIDAS.has(clave)) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: perfil } = await supabase
    .from('profiles')
    .select('status, access_until, grace_ends_at')
    .eq('id', auth.user.id)
    .maybeSingle();
  if (!tieneAcceso(perfil as PerfilAcceso | null)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const admin = createAdmin(limpiarEnv(process.env.SUPABASE_URL), limpiarEnv(process.env.SUPABASE_SECRET_KEY), {
    auth: { persistSession: false },
  });

  // La extensión depende de cómo grabe/exporte la usuaria (m4a, mp3…): se busca el archivo por su nombre base.
  const { data: archivos, error: errLista } = await admin.storage.from('practicas').list('', { search: clave, limit: 10 });
  if (errLista) {
    console.error('practicas/audio: no se pudo listar el bucket', { message: errLista.message });
    return NextResponse.json({ error: 'storage' }, { status: 500 });
  }
  const archivo = archivos?.find((f) => f.name.startsWith(`${clave}.`));
  if (!archivo) return NextResponse.json({ error: 'not_recorded_yet' }, { status: 404 });

  const { data: firmada, error: errFirma } = await admin.storage.from('practicas').createSignedUrl(archivo.name, SEGUNDOS_URL);
  if (errFirma || !firmada) {
    console.error('practicas/audio: no se pudo firmar la URL', { message: errFirma?.message });
    return NextResponse.json({ error: 'storage' }, { status: 500 });
  }

  return NextResponse.json({ url: firmada.signedUrl }, { headers: { 'Cache-Control': 'private, no-store' } });
}
