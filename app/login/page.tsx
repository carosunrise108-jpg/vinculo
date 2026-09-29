'use client';

// LOGIN — Vínculo. Sigue 50-DISENO-ONBOARDING-PAYWALL.md → E. Passwordless por
// defecto (26-AUTH-MODERNO.md, decisión de ESTADO.md): magic link + Google.
// Supabase Auth REAL desde la Sesión 6 — el enlace lo envía Supabase (Resend llega
// en un paso posterior de la Sesión 6 para personalizar la plantilla de correo).

import { useState } from 'react';
import { FunnelHeader, FunnelCta } from '@/components/funnel/ui';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Estado = 'idle' | 'enviando' | 'enviado' | 'error';

export default function Login() {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');
  const [segundos, setSegundos] = useState(0);

  const enviar = async () => {
    if (!email.includes('@')) {
      setEstado('error');
      return;
    }
    setEstado('enviando');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });
    if (error) {
      setEstado('error');
      return;
    }
    setEstado('enviado');
    setSegundos(60);
    const id = setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const continuarConGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)] [font-family:var(--font-body)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-4">
        <FunnelHeader />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="flex flex-1 flex-col justify-center gap-6 pb-16"
        >
          {estado !== 'enviado' ? (
            <>
              <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                <h1 className="text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
                  Entra a tu Mapa
                </h1>
                <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
                  Para guardarlo y verlo en cualquier dispositivo.
                </p>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col gap-3">
                <input
                  type="email"
                  inputMode="email"
                  autoFocus
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (estado === 'error') setEstado('idle');
                  }}
                  className={`h-14 w-full rounded-[var(--radius-button)] border bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none ${
                    estado === 'error' ? 'border-[var(--color-error)]' : 'border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] focus:border-[var(--accent)]'
                  }`}
                />
                {estado === 'error' && (
                  <p className="text-[13px] text-[var(--color-error)]">No pudimos enviar el enlace. Revisa el correo e intenta de nuevo.</p>
                )}
                <FunnelCta onClick={enviar} disabled={estado === 'enviando'}>
                  {estado === 'enviando' ? 'Enviando…' : 'Enviarme mi enlace de acceso'}
                </FunnelCta>
                <button
                  type="button"
                  onClick={continuarConGoogle}
                  className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] bg-[var(--surface)] text-[15px] font-semibold text-[var(--text-primary)] [touch-action:manipulation]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
                  Continuar con Google
                </button>
              </motion.div>

              <motion.p variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="flex items-center justify-center gap-1.5 text-center text-[13px] text-[var(--text-secondary)]">
                <Lock size={13} strokeWidth={2} aria-hidden="true" /> Sin contraseñas: te llegará un enlace de un solo uso.
              </motion.p>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
                Revisa tu correo
              </h1>
              <p className="mt-3 text-[15px] text-[var(--text-secondary)]">
                Te enviamos el enlace a <span className="font-semibold text-[var(--text-primary)]">{email}</span>
              </p>
              <button
                type="button"
                disabled={segundos > 0}
                onClick={enviar}
                className="mt-6 text-[14px] font-semibold text-[var(--accent)] disabled:text-[var(--text-secondary)]"
              >
                {segundos > 0 ? `Reenviar en ${segundos}s` : 'Reenviar enlace'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
