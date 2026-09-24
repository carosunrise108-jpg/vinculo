// Cliente de Supabase para el NAVEGADOR (componentes 'use client'). Solo usa las claves
// públicas (NEXT_PUBLIC_*) — la service_role NUNCA vive aquí (09-SEGURIDAD.md).
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
