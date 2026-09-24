// Cliente de Supabase para el SERVIDOR (Server Components, Route Handlers). Lee/escribe la
// cookie de sesión — necesario para que el login por enlace mágico persista entre requests.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Ocurre si setAll se llama desde un Server Component (no puede escribir
            // cookies) — el middleware ya se encarga de refrescar la sesión, así que
            // este catch es seguro de ignorar (patrón oficial de @supabase/ssr).
          }
        },
      },
    }
  );
}
