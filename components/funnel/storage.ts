// Persistencia sin backend (51-STACK-PINEADO): las respuestas del onboarding viven en
// localStorage hasta la Sesión 6, cuando Supabase entra y el registro/login las sube a la
// cuenta real. Todo lo que lee esta clave es texto elegido por la usuaria en el flujo — se
// trata como dato de UI, no como fuente de verdad de producción.

export interface RespuestasOnboarding {
  momentoVacio?: string;
  yaIntento?: string;
  deseo?: string;
  momentoDelDia?: string;
  minutosDia?: number;
  comoLlego?: string;
}

const KEY = 'vinculo_onboarding_v1';

/** Devuelve false si localStorage no está disponible (modo privado, cupo lleno, etc.)
 * para que la pantalla que llama pueda mostrar un aviso en vez de fallar en silencio. */
export function guardarRespuestas(r: RespuestasOnboarding): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(r));
    return true;
  } catch {
    return false;
  }
}

export function leerRespuestas(): RespuestasOnboarding {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RespuestasOnboarding) : {};
  } catch {
    return {};
  }
}

export function contarRespuestas(r: RespuestasOnboarding): number {
  return Object.values(r).filter((v) => v !== undefined && v !== '').length;
}

// ── Test de Vínculo v2 (rebrand 2026-09-29) — reemplaza el onboarding de arriba.
// Se deja el bloque viejo sin borrar por ahora (nada lo rompe al dejarlo), se retira
// cuando el rebrand termine todas sus capas (ver ESTADO.md).

const KEY_TEST = 'vinculo_test_v1';

/** id de pregunta -> puntaje elegido (0-3). */
export type RespuestasTest = Record<string, number>;

export function guardarRespuestasTest(r: RespuestasTest): boolean {
  try {
    window.localStorage.setItem(KEY_TEST, JSON.stringify(r));
    return true;
  } catch {
    return false;
  }
}

export function leerRespuestasTest(): RespuestasTest {
  try {
    const raw = window.localStorage.getItem(KEY_TEST);
    return raw ? (JSON.parse(raw) as RespuestasTest) : {};
  } catch {
    return {};
  }
}
