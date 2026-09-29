import crypto from 'node:crypto';

/** Comparación en tiempo constante (anti timing-attack). timingSafeEqual exige buffers
 * de igual longitud; comparamos la longitud primero y solo entonces los bytes. */
function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** Hotmart autentica con un hottok (token único de la cuenta) comparado en tiempo
 * constante sobre HTTPS — no una firma HMAC inventada por nosotros.
 * Fail-secure (09-SEGURIDAD/27): el secreto se lee en cada llamada (no al cargar el módulo,
 * para no tumbar el build/deploy entero por una variable de un endpoint puntual) — si falta,
 * ninguna petición puede autenticarse nunca, sin default de juguete. */
export function verifyHotmart(opts: { hottok?: string }): boolean {
  const HOTTOK = process.env.HOTMART_HOTTOK;
  if (!HOTTOK) {
    console.error('FALTA HOTMART_HOTTOK — el webhook de Hotmart no puede autenticar peticiones');
    return false;
  }
  if (!opts.hottok) return false;
  return timingSafeEqualStr(opts.hottok, HOTTOK);
}
