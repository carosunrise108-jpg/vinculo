// Estado de la app interna — Sesión 6: conectado a Supabase real (tabla app_progreso,
// RLS por usuario). Reemplaza el localStorage de la Sesión 5 manteniendo la MISMA lógica
// de negocio (paso de hoy, conteo, etapas por avance real — nunca por calendario).

import { createClient } from '@/lib/supabase/client';
import { leerRespuestasTest } from '@/components/funnel/storage';
import { calcularResultado, categoriaMasDebil, type ResultadoCategoria } from '@/lib/test-vinculo';
import { practicasDeEtapa } from '@/lib/practicas';

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
  pasosCompletados: number; // total histórico de prácticas hechas
  vuelta: number; // cuántas veces lleva recorriendo la etapa actual (espiral: nunca termina)
  practicaActual: number; // cuál práctica de la etapa le toca hoy (1..N, se envuelve)
}

const REGISTRO_INICIAL: RegistroApp = {
  etapaActual: 1,
  pasoHoyEstado: 'pendiente',
  pasosCompletados: 0,
  vuelta: 1,
  practicaActual: 1,
};

interface FilaProgreso {
  etapa_actual: number;
  paso_hoy_estado: string;
  pasos_completados: number;
  vuelta: number;
  practica_actual: number;
  updated_at: string;
}

const COLUMNAS_PROGRESO = 'etapa_actual, paso_hoy_estado, pasos_completados, vuelta, practica_actual, updated_at';

function mismoDia(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Lee el progreso del usuario logueado. Devuelve null si no hay sesión (llamar redirige a /login).
 * Aplica el CAMBIO DE DÍA: lo que se registró ayer no cuenta como "hoy". Si ayer la hizo, hoy toca
 * la siguiente práctica (y al pasar la última, empieza una vuelta nueva y más profunda); si ayer
 * la intentó o no pudo, hoy retoma la MISMA, sin culpa. */
export async function leerRegistro(): Promise<RegistroApp | null> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data, error } = await supabase
    .from('app_progreso')
    .select(COLUMNAS_PROGRESO)
    .eq('user_id', auth.user.id)
    .maybeSingle<FilaProgreso>();

  // El trigger handle_new_user crea la fila al confirmarse la cuenta; si por alguna
  // razón todavía no existe (carrera con el trigger), se trata como el punto de partida.
  if (error || !data) return { ...REGISTRO_INICIAL };

  let registro: RegistroApp = {
    etapaActual: data.etapa_actual,
    pasoHoyEstado: data.paso_hoy_estado as EstadoPaso,
    pasosCompletados: data.pasos_completados,
    vuelta: data.vuelta,
    practicaActual: data.practica_actual,
  };

  const hoy = new Date();
  if (registro.pasoHoyEstado !== 'pendiente' && !mismoDia(new Date(data.updated_at), hoy)) {
    const total = practicasDeEtapa(registro.etapaActual).length || 1;
    let practicaActual = registro.practicaActual;
    let vuelta = registro.vuelta;
    if (registro.pasoHoyEstado === 'hecho') {
      practicaActual += 1;
      if (practicaActual > total) {
        practicaActual = 1;
        vuelta += 1;
      }
    }
    registro = { ...registro, pasoHoyEstado: 'pendiente', practicaActual, vuelta };
    await supabase
      .from('app_progreso')
      .update({
        paso_hoy_estado: 'pendiente',
        practica_actual: practicaActual,
        vuelta,
        updated_at: hoy.toISOString(),
      })
      .eq('user_id', auth.user.id);
  }
  return registro;
}

export interface ResultadoCheckin {
  registro: RegistroApp;
  guardadoOk: boolean;
  /** Se acaba de completar la última práctica de la vuelta — un hito real (FICHA-ARTE: celebrar solo hitos reales). */
  completoVuelta: boolean;
}

/** Registra cómo le fue hoy. Cambiar la respuesta del día suma/resta UNA sola vez a las prácticas
 * hechas (re-tocar la misma opción no infla el contador ni dispara una celebración falsa). */
export async function registrarPasoHoy(estado: EstadoPaso): Promise<ResultadoCheckin> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { registro: { ...REGISTRO_INICIAL }, guardadoOk: false, completoVuelta: false };
  }

  const base = (await leerRegistro()) ?? { ...REGISTRO_INICIAL };

  const yaEstabaHecho = base.pasoHoyEstado === 'hecho';
  const ahoraHecho = estado === 'hecho';
  let pasosCompletados = base.pasosCompletados;
  if (ahoraHecho && !yaEstabaHecho) pasosCompletados += 1;
  else if (!ahoraHecho && yaEstabaHecho) pasosCompletados = Math.max(0, pasosCompletados - 1);

  const total = practicasDeEtapa(base.etapaActual).length || 1;
  const completoVuelta = ahoraHecho && !yaEstabaHecho && base.practicaActual === total;

  const { error } = await supabase
    .from('app_progreso')
    .update({ paso_hoy_estado: estado, pasos_completados: pasosCompletados, updated_at: new Date().toISOString() })
    .eq('user_id', auth.user.id);

  return {
    registro: { ...base, pasoHoyEstado: estado, pasosCompletados },
    guardadoOk: !error,
    completoVuelta,
  };
}

// ── DIARIO: lo que la persona escribe después de cada práctica (privado por usuaria, RLS) ──

export interface EntradaDiario {
  id: string;
  practica_id: string;
  etapa: number;
  vuelta: number;
  pregunta: string | null;
  texto: string;
  created_at: string;
}

export async function guardarEntradaDiario(e: {
  practica_id: string;
  etapa: number;
  vuelta: number;
  pregunta: string | null;
  texto: string;
}): Promise<boolean> {
  const texto = e.texto.trim();
  if (!texto) return false;
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;
  const { error } = await supabase.from('diario_entradas').insert({
    user_id: auth.user.id,
    practica_id: e.practica_id,
    etapa: e.etapa,
    vuelta: e.vuelta,
    pregunta: e.pregunta,
    texto: texto.slice(0, 5000),
  });
  return !error;
}

export async function leerEntradasDiario(limite = 50): Promise<EntradaDiario[]> {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  const { data } = await supabase
    .from('diario_entradas')
    .select('id, practica_id, etapa, vuelta, pregunta, texto, created_at')
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false })
    .limit(limite);
  return (data ?? []) as EntradaDiario[];
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
