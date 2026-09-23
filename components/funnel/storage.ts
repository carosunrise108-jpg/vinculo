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
