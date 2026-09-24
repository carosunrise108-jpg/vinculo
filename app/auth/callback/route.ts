// Recibe el redirect de Supabase Auth (enlace mágico o Google) y crea la sesión real.
// El trigger handle_new_user (Sesión 6, Supabase) ya creó profiles/app_progreso si es
// la primera vez — aquí solo intercambiamos el código por cookies de sesión.
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/app';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=enlace_invalido`);
}
