'use client';

// UI compartida del funnel de onboarding/paywall/login — construida siguiendo
// 50-DISENO-ONBOARDING-PAYWALL.md al pixel (barra de progreso, chips, CTA fijo).
// Reutiliza los tokens de components/landing/tokens.css (ya global vía app/globals.css)
// y las piezas premium de components/landing/ui.tsx donde aplica (no se reinventan).

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, Check } from 'lucide-react';

/** Header de marca del funnel: logo + nombre, siempre presente (50, regla de marca). */
export function FunnelHeader({ appName = 'Vínculo' }: { appName?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2 py-4 text-[15px] font-semibold text-[var(--text-primary)]">
      <span aria-hidden="true" className="size-6 rounded-[8px] bg-[var(--accent)]" />
      {appName}
    </Link>
  );
}

/** Barra fina 2-3px con % real, animada, arranca en 5-8% (endowed progress, A2 de 50). */
export function BarraProgreso({ pct, onAtras }: { pct: number; onAtras?: () => void }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-center gap-3">
      {onAtras ? (
        <button
          type="button"
          onClick={onAtras}
          aria-label="Atrás"
          className="-ml-2 flex size-11 shrink-0 items-center justify-center text-[var(--text-secondary)]"
        >
          <ChevronLeft size={22} strokeWidth={2.4} />
        </button>
      ) : (
        <span className="size-11 shrink-0" aria-hidden="true" />
      )}
      <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_15%,transparent)]">
        <motion.div
          className="h-full rounded-full bg-[var(--accent)]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="w-9 shrink-0 text-right text-[12px] font-semibold tabular-nums text-[var(--text-secondary)]">
        {Math.round(pct)}%
      </span>
    </div>
  );
}

/** Chip de opción de ancho completo — selección única, auto-avanza (A2/A3 de 50). */
export function ChipOpcion({
  label,
  seleccionado,
  onClick,
}: {
  label: string;
  seleccionado?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex h-14 w-full items-center justify-between rounded-[var(--radius-button)] px-4 text-[16px] font-medium transition-colors duration-150 ${
        seleccionado
          ? 'border-[1.5px] border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text-primary)]'
          : 'border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] text-[var(--text-primary)]'
      }`}
    >
      <span className="text-left">{label}</span>
      {seleccionado && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]"
        >
          <Check size={13} strokeWidth={3} color="var(--bg)" />
        </motion.span>
      )}
    </motion.button>
  );
}

/** Contenedor de una pregunta: título + micro-copy + lista de chips, con transición A4. */
export function PantallaPregunta({
  pregunta,
  microCopy,
  children,
}: {
  pregunta: string;
  microCopy?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      key={pregunta}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3 pt-6"
    >
      <h1 className="text-balance text-[28px] font-bold leading-[1.12] tracking-[-0.01em] text-[var(--text-primary)] [font-family:var(--font-display)]">
        {pregunta}
      </h1>
      {microCopy && <p className="text-[15px] leading-snug text-[var(--text-secondary)]">{microCopy}</p>}
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </motion.div>
  );
}

/** CTA fijo del funnel (selección múltiple, slider, input libre, loading→paywall). */
export function FunnelCta({
  children,
  onClick,
  disabled,
  href,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
}) {
  const clases = `flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] text-[16px] font-semibold transition-opacity duration-150 [touch-action:manipulation] ${
    disabled
      ? 'cursor-not-allowed bg-[var(--accent)] opacity-40 text-[var(--bg)]'
      : 'bg-[var(--accent)] text-[var(--bg)] shadow-[0_10px_24px_color-mix(in_oklab,var(--accent)_40%,transparent)]'
  }`;
  if (href && !disabled) {
    return (
      <motion.a whileTap={{ scale: 0.97 }} href={href} className={clases}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button whileTap={disabled ? undefined : { scale: 0.97 }} type="button" onClick={onClick} disabled={disabled} className={clases}>
      {children}
    </motion.button>
  );
}
