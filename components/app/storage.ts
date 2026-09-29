// Estado de la app interna — Sesión 6: conectado a Supabase real (tabla app_progreso,
// RLS por usuario). Reemplaza el localStorage de la Sesión 5 manteniendo la MISMA lógica
// de negocio (paso de hoy, conteo, etapas por avance real — nunca por calendario).

import { createClient } from '@/lib/supabase/client';
import { leerRespuestasTest } from '@/components/funnel/storage';
import { calcularResultado, categoriaMasDebil, type ResultadoCategoria } from '@/lib/test-vinculo';

export interface Etapa {
  numero: number;
  nombre: string;
  resumen: string;
  /** Práctica guiada del día para esta etapa — sin audio real todavía (FICHA-ARTE v2, pendiente de la usuaria). */
  practica: { titulo: string; duracion: string };
}

// Las 5 etapas del Camino — rebrand v2 (FICHA-ARTE.md → "Producto y voz"), reemplazan
// las 5 de v1 ("Ver tu patrón"…). Mismo principio de fondo: se ganan por avance real,
// nunca por calendario (Constitución del Producto, punto 6).
export const ETAPAS: Etapa[] = [
  { numero: 1, nombre: 'Quietud', resumen: 'Aprender a estar en silencio sin llenarlo con nada.', practica: { titulo: 'Respiración de 5 minutos', duracion: '5 min' } },
  { numero: 2, nombre: 'Presencia', resumen: 'Notar lo que sientes hoy, sin apurarte a cambiarlo.', practica: { titulo: 'Escaneo corporal breve', duracion: '6 min' } },
  { numero: 3, nombre: 'Raíz', resumen: 'Entender de dónde viene tu patrón de conexión.', practica: { titulo: 'Reflexión guiada sobre tu patrón', duracion: '7 min' } },
  { numero: 4, nombre: 'Apertura', resumen: 'Un paso pequeño hacia afuera, sostenido por lo que ya construiste contigo.', practica: { titulo: 'Práctica de apertura', duracion: '6 min' } },
  { numero: 5, nombre: 'Vínculo', resumen: 'Con gente que comparte tu forma de ver la vida — la que ya conoces, y la que todavía no.', practica: { titulo: 'Cierre y gratitud', duracion: '5 min' } },
];

export type EstadoPaso = 'hecho' | 'intentado' | 'no-pude' | 'pendiente';

export interface RegistroApp {
  etapaActual: number; // 1-5
  pasoHoyEstado: EstadoPaso;
  pasosCompletados: number; // total histórico — alimenta "Tu Mapa"
}

const PASOS_POR_ETAPA = 3;

function filaAregistro(fila: { etapa_actual: number; paso_hoy_estado: string; pasos_completados: number }): RegistroApp {
  return {
    etapaActual: fila.etapa_actual,
    pasoHoyEstado: fila.paso_hoy_estado as EstadoPaso,
    pasosCompletados: fila.pasos_completados,
  };
}

/** Lee el progreso del usuario logueado. Devuelve null si no hay sesión (llamar redirige a /login). */
export async function leerRegistro(): Promise<RegistroApp | null> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data, error } = await supabase
    .from('app_progreso')
    .select('etapa_actual, paso_hoy_estado, pasos_completados')
    .eq('user_id', auth.user.id)
    .maybeSingle();

  // El trigger handle_new_user crea la fila al confirmarse la cuenta; si por alguna
  // razón todavía no existe (carrera con el trigger), se trata como el punto de partida.
  if (error || !data) return { etapaActual: 1, pasoHoyEstado: 'pendiente', pasosCompletados: 0 };
  return filaAregistro(data);
}

export interface ResultadoCheckin {
  registro: RegistroApp;
  guardadoOk: boolean;
  subioEtapa: boolean;
}

// Cada 3 pasos "hechos" se gana la siguiente etapa — avance por progreso REAL,
// nunca por calendario (Constitución del Producto, punto 6). Solo se celebra
// esto: un hito real, no cualquier tap (FICHA-ARTE: "celebrar solo hitos reales").
export async function registrarPasoHoy(estado: EstadoPaso): Promise<ResultadoCheckin> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { registro: { etapaActual: 1, pasoHoyEstado: 'pendiente', pasosCompletados: 0 }, guardadoOk: false, subioEtapa: false };
  }

  const actual = await leerRegistro();
  const base = actual ?? { etapaActual: 1, pasoHoyEstado: 'pendiente' as EstadoPaso, pasosCompletados: 0 };

  const yaEstabaHecho = base.pasoHoyEstado === 'hecho';
  const ahoraHecho = estado === 'hecho';
  // Cambiar la respuesta de hoy suma/resta UNA sola vez (nunca por re-tocar la
  // misma opción) — evita inflar el contador y disparar una celebración falsa.
  let pasosCompletados = base.pasosCompletados;
  if (ahoraHecho && !yaEstabaHecho) pasosCompletados += 1;
  else if (!ahoraHecho && yaEstabaHecho) pasosCompletados = Math.max(0, pasosCompletados - 1);

  const subioEtapa =
    ahoraHecho && !yaEstabaHecho && base.etapaActual < ETAPAS.length && pasosCompletados % PASOS_POR_ETAPA === 0;
  const etapaActual = subioEtapa ? base.etapaActual + 1 : base.etapaActual;

  const { error } = await supabase
    .from('app_progreso')
    .update({ paso_hoy_estado: estado, pasos_completados: pasosCompletados, etapa_actual: etapaActual, updated_at: new Date().toISOString() })
    .eq('user_id', auth.user.id);

  return {
    registro: { etapaActual, pasoHoyEstado: estado, pasosCompletados },
    guardadoOk: !error,
    subioEtapa,
  };
}

/**
 * Migra las respuestas del test de Vínculo (guardadas en localStorage ANTES del
 * login — Modelo 2A de 02C) a Supabase, una sola vez por usuario. Se llama al
 * entrar a /app recién logueado; si ya existe la fila o no hay nada que migrar,
 * no hace nada.
 */
export async function migrarOnboardingSiHaceFalta(): Promise<void> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;

  const { data: existente } = await supabase
    .from('onboarding_responses')
    .select('user_id')
    .eq('user_id', auth.user.id)
    .maybeSingle();
  if (existente) return; // ya migrado

  const respuestas = leerRespuestasTest();
  if (Object.keys(respuestas).length === 0) return;

  await supabase.from('onboarding_responses').upsert({ user_id: auth.user.id, respuestas });

  try {
    window.localStorage.removeItem('vinculo_test_v1');
  } catch {
    // no crítico: ya migró a Supabase, que es la fuente de verdad desde ahora.
  }
}

/** Resultado del Mapa de conexión (5 categorías) desde Supabase, para la pestaña Mapa. */
export async function leerResultadoMapa(): Promise<ResultadoCategoria[] | null> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data } = await supabase
    .from('onboarding_responses')
    .select('respuestas')
    .eq('user_id', auth.user.id)
    .maybeSingle();
  if (!data || !data.respuestas || Object.keys(data.respuestas).length === 0) return null;
  return calcularResultado(data.respuestas as Record<string, number>);
}

export { categoriaMasDebil };
