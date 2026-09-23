// Estado de la app interna — Sesión 5. Sin Supabase todavía (Sesión 6): las etapas y el
// registro de pasos viven en localStorage, con la MISMA forma que tendrán las tablas reales
// (route_steps / step_logs de ESTADO.md) para que migrar sea solo cambiar dónde se guarda.

export interface Etapa {
  numero: number;
  nombre: string;
  resumen: string;
}

// Las 5 etapas de la Ruta — derivadas del Mapa de Desconexión (ESTADO.md, 4b) y
// reescritas en lenguaje abierto/secular a partir del insumo de la usuaria del
// 2026-09-23 (se descartó todo el vocabulario de fe/religión, per FICHA-AVATAR:
// "NUNCA presentarse como terapia/tratamiento", sin dogma).
export const ETAPAS: Etapa[] = [
  { numero: 1, nombre: 'Ver tu patrón', resumen: 'De dónde viene tu desconexión — sin culpa, con tus propias respuestas.' },
  { numero: 2, nombre: 'Aquietar el ruido', resumen: 'Bajarle el volumen a lo que alimenta el vacío: el scroll, la comparación, el otro match que no lleva a nada.' },
  { numero: 3, nombre: 'Escucharte a ti misma', resumen: 'Practicar estar contigo sin llenar el silencio con el celular.' },
  { numero: 4, nombre: 'Tu ritual semanal', resumen: 'Un paso pequeño y sostenible que se vuelve costumbre.' },
  { numero: 5, nombre: 'Abrirte a los demás', resumen: 'Con lo que ya construiste contigo, das el paso hacia gente real.' },
];

export type EstadoPaso = 'hecho' | 'intentado' | 'no-pude' | 'pendiente';

export interface RegistroApp {
  etapaActual: number; // 1-5, índice en ETAPAS
  pasoHoyEstado: EstadoPaso;
  pasosCompletados: number; // total histórico — alimenta "Tu Mapa"
}

const KEY = 'vinculo_app_v1';

const INICIAL: RegistroApp = {
  etapaActual: 2,
  pasoHoyEstado: 'pendiente',
  pasosCompletados: 1,
};

export function leerRegistro(): RegistroApp {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...INICIAL, ...(JSON.parse(raw) as Partial<RegistroApp>) } : INICIAL;
  } catch {
    return INICIAL;
  }
}

export function guardarRegistro(r: RegistroApp): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(r));
    return true;
  } catch {
    return false;
  }
}

export function registrarPasoHoy(estado: EstadoPaso): RegistroApp {
  const actual = leerRegistro();
  const nuevo: RegistroApp = {
    ...actual,
    pasoHoyEstado: estado,
    pasosCompletados: estado === 'hecho' ? actual.pasosCompletados + 1 : actual.pasosCompletados,
  };
  guardarRegistro(nuevo);
  return nuevo;
}
