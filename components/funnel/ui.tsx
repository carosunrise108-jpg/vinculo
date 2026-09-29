'use client';

// UI compartida del funnel de onboarding/paywall/login — construida siguiendo
// 50-DISENO-ONBOARDING-PAYWALL.md al pixel (barra de progreso, chips, CTA fijo).
// Reutiliza los tokens de components/landing/tokens.css (ya global vía app/globals.css)
// y las piezas premium de components/landing/ui.tsx donde aplica (no se reinventan).

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, Check, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Hairline, IconChip, Kicker } from '@/components/landing/ui';
import { VinculoSimbolo } from '@/components/brand/simbolo';

/** Header de marca del funnel: logo + nombre + salida explícita (50, regla de marca
 * y heurística 3 de Nielsen — control y libertad: siempre debe haber por dónde salir). */
export function FunnelHeader({
  appName = 'Vínculo',
  onCerrar,
}: {
  appName?: string;
  /** Si se pasa, muestra una X a la derecha que sale del flujo (ej. router.push('/')). */
  onCerrar?: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold text-[var(--text-primary)]">
        <VinculoSimbolo size={20} color="var(--text-primary)" />
        {appName}
      </Link>
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Salir"
          className="flex size-11 -mr-2 items-center justify-center text-[var(--text-secondary)]"
        >
          <X size={20} strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}

/** Barra fina 2-3px con % real, animada, arranca en 5-8% (endowed progress, A2 de 50). */
export function BarraProgreso({
  pct,
  onAtras,
  label,
}: {
  pct: number;
  onAtras?: () => void;
  /** Texto a la derecha — por defecto "{pct}%"; pásalo para mostrar "N/12" (App-Test). */
  label?: string;
}) {
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
      <span className="w-11 shrink-0 text-right text-[12px] font-semibold tabular-nums text-[var(--text-secondary)]">
        {label ?? `${Math.round(pct)}%`}
      </span>
    </div>
  );
}

/** Chip de opción de ancho completo — selección única, auto-avanza (A2/A3 de 50).
 * Derechas (sin inclinación) — la usuaria pidió quitar el efecto "pegatina" de las
 * opciones marcables del test (2026-09-29): quedan rectas, con entrada escalonada. */
export function ChipOpcion({
  label,
  seleccionado,
  onClick,
  index = 0,
}: {
  label: string;
  seleccionado?: boolean;
  onClick: () => void;
  index?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, delay: reduce ? 0 : index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        boxShadow: seleccionado ? undefined : '0 6px 14px -9px color-mix(in oklab, var(--text-primary) 28%, transparent)',
      }}
      className={`flex h-14 w-full items-center justify-between rounded-[var(--radius-button)] px-4 text-[16px] font-medium transition-colors duration-150 ${
        seleccionado
          ? 'border-[1.5px] border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text-primary)] shadow-[0_8px_18px_-6px_color-mix(in_oklab,var(--accent)_45%,transparent)]'
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

/** Palabra(s) clave resaltadas en acento dentro de un titular — JERARQUÍA DE ÉNFASIS (55). */
export function conAcento(texto: string, resaltar: string): ReactNode {
  const i = texto.toLowerCase().indexOf(resaltar.toLowerCase());
  if (i === -1) return texto;
  return (
    <>
      {texto.slice(0, i)}
      <span className="text-[var(--accent)]">{texto.slice(i, i + resaltar.length)}</span>
      {texto.slice(i + resaltar.length)}
    </>
  );
}

/** Fondo con profundidad del funnel — mesh del acento, con opacidad calibrada
 * para leerse en pantalla real (14 — nunca fill plano). */
export function FondoFunnel() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          // Tres rondas del revisor marcaron el mesh como "imperceptible" incluso tras
          // subir la opacidad dos veces — el problema era el radio de caída, no el %:
          // con transparent tan lejos del centro, el pico saturado ocupaba muy poco
          // área real. Blobs más chicos y con el pico sostenido se ven de verdad.
          'radial-gradient(520px 520px at 2% -6%, color-mix(in oklab, var(--accent) 55%, transparent) 0%, color-mix(in oklab, var(--accent) 20%, transparent) 32%, transparent 46%), ' +
          'radial-gradient(460px 460px at 106% 10%, color-mix(in oklab, var(--accent-2) 48%, transparent) 0%, color-mix(in oklab, var(--accent-2) 16%, transparent) 30%, transparent 44%), ' +
          'radial-gradient(460px 420px at 48% 108%, color-mix(in oklab, var(--accent) 34%, transparent) 0%, transparent 42%), ' +
          // 4º blob, centrado y grande: cubre la franja media (timeline/CTA/trust row del
          // paywall, cuerpo de las preguntas) que los 3 de esquina dejaban plana (ronda 4).
          'radial-gradient(900px 700px at 50% 48%, color-mix(in oklab, var(--surface-2) 32%, transparent) 0%, transparent 62%)',
      }}
    />
  );
}

/** Contenedor de una pregunta: título + micro-copy + lista de chips, con transición A4. */
export function PantallaPregunta({
  pregunta,
  acento,
  microCopy,
  icono: Icono,
  kicker,
  piePersonalizado,
  children,
}: {
  pregunta: string;
  /** Palabra o frase corta del titular a resaltar en var(--accent) — JERARQUÍA DE ÉNFASIS (55). */
  acento?: string;
  microCopy?: string;
  /** Ícono de tema arriba del titular, con hairline degradé (gate de detalles premium, 55). */
  icono?: LucideIcon;
  /** Etiqueta corta en mayúsculas arriba del titular (ej. "Test inicial · Contigo"). */
  kicker?: string;
  /** Reemplaza el pie "Puedes cambiar tu respuesta más adelante." — pásalo vacío ('') para quitarlo. */
  piePersonalizado?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={pregunta}
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: reduce ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col justify-start gap-3 pt-8"
    >
      {kicker && <Kicker>{kicker}</Kicker>}
      {Icono && (
        <Hairline emphasis className="mb-1 w-fit rounded-full">
          <IconChip icon={Icono} />
        </Hairline>
      )}
      <h1 className="text-balance text-[28px] font-bold leading-[1.12] tracking-[-0.01em] text-[var(--text-primary)] [font-family:var(--font-display)]">
        {acento ? conAcento(pregunta, acento) : pregunta}
      </h1>
      {microCopy && <p className="text-[15px] leading-snug text-[var(--text-secondary)]">{microCopy}</p>}
      <div className="mt-3 flex flex-col gap-3">{children}</div>
      {/* Ancla el bloque arriba (52) sin dejar aire muerto abajo: en preguntas cortas
       * (3-4 chips) este texto real ocupa el resto — no es relleno, es tranquilidad real. */}
      {piePersonalizado !== '' && (
        <p className="mt-auto pt-10 text-center text-[13px] text-[var(--text-secondary)]">
          {piePersonalizado ?? 'Puedes cambiar tu respuesta más adelante.'}
        </p>
      )}
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
  // CTA primario = píldora "tinta" (FICHA-ARTE v2): fondo var(--text-primary), nunca
  // el acento — el acento es color de dato, no de botón.
  const clases = `flex h-[52px] w-full items-center justify-center rounded-[var(--radius-pill)] text-[16px] font-semibold transition-opacity duration-150 [touch-action:manipulation] ${
    disabled
      ? 'cursor-not-allowed bg-[var(--text-primary)] opacity-40 text-[var(--surface)]'
      : 'bg-[var(--text-primary)] text-[var(--surface)] shadow-[0_10px_24px_color-mix(in_oklab,var(--text-primary)_35%,transparent)]'
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
