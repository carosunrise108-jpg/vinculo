// Refresca la sesión de Supabase en cada request (patrón oficial @supabase/ssr para
// Next.js App Router) — sin esto, el token expira y el usuario se desloguea solo.
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { tieneAcceso, type PerfilAcceso } from '@/lib/membership-fsm';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  // No borrar: getUser() es lo que efectivamente refresca el token.
  const { data: auth } = await supabase.auth.getUser();

  // COMPUERTA DE PAGO (en el servidor, no solo escondiendo la ruta — eso sería un IDOR):
  // /app exige sesión Y una suscripción vigente. Cuenta creada sin comprar → a la pantalla de planes.
  const { pathname } = request.nextUrl;
  if (pathname === '/app' || pathname.startsWith('/app/')) {
    if (!auth.user) return redirigir(request, supabaseResponse, '/login');

    const { data: perfil } = await supabase
      .from('profiles')
      .select('status, access_until, grace_ends_at')
      .eq('id', auth.user.id)
      .maybeSingle();

    if (!tieneAcceso(perfil as PerfilAcceso | null)) return redirigir(request, supabaseResponse, '/paywall', 'sin_acceso=1');
  }

  return supabaseResponse;
}

function redirigir(request: NextRequest, conSesion: NextResponse, ruta: string, query?: string) {
  const url = request.nextUrl.clone();
  url.pathname = ruta;
  url.search = query ? `?${query}` : '';
  const respuesta = NextResponse.redirect(url);
  // Conserva las cookies de sesión recién refrescadas (si no, el redirect desloguearía en silencio).
  conSesion.cookies.getAll().forEach((c) => respuesta.cookies.set(c));
  return respuesta;
}
