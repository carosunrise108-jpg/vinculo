'use client';

// PAYWALL — Vínculo. Sigue 50-DISENO-ONBOARDING-PAYWALL.md → C1 (blueprint) + C4
// (timeline del trial, el visual default con trial). Copy derivado de FICHA-AVATAR.md
// (57 §9): headline con el deseo #1, línea de pérdida con el dolor #1, CTA en 1ª
// persona, garantía con plazo real (FICHA-MERCADO §4).
//
// Precio y trial: FICHA-MERCADO.md §1/§4 + ESTADO.md → Estrategia de monetización.
// Hotmart aún no está conectado (Sesión 6) — el CTA simula el flujo con estado local
// y lleva a /login, honesto sobre su naturaleza (19 → mockups honestos, aplica igual aquí).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';
import { FondoFunnel } from '@/components/funnel/ui';
import { leerRespuestas, contarRespuestas } from '@/components/funnel/storage';

type PlanId = 'anual' | 'mensual';

const PLANES = {
  anual: {
    nombre: 'Anual', badge: 'MEJOR VALOR', precioMes: '$4.17',
    totalAnual: 'Se cobra US$49.99/año', ahorro: 'Más de la mitad de descuento vs. mensual',
    diaCobro: 'el día 8', montoCobro: 'US$49.99',
  },
  mensual: {
    nombre: 'Mensual', badge: null, precioMes: '$8.99',
    totalAnual: null, ahorro: null,
    diaCobro: 'el día 8', montoCobro: 'US$8.99',
  },
} as const;

export default function Paywall() {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanId>('anual');
  const [nRespuestas, setNRespuestas] = useState(6);
  const [deseo, setDeseo] = useState('estar bien contigo misma');
  const [restaurarMsg, setRestaurarMsg] = useState(false);

  useEffect(() => {
    const r = leerRespuestas();
    const n = contarRespuestas(r);
    if (n > 0) setNRespuestas(n);
    if (r.deseo) setDeseo(r.deseo.toLowerCase());
  }, []);

  const seleccionado = PLANES[plan];
  const deseoCorto = deseo.split(' ').slice(0, 3).join(' ');
  const reduce = useReducedMotion();

  return (
    <div className="min-h-dvh bg-[var(--bg)] [font-family:var(--font-body)]">
      <FondoFunnel />
      <div className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-4 pb-8">
        {/* (1) Cierre — 44px, visible desde el frame 1 */}
        <div className="flex h-14 items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/')}
            aria-label="Cerrar"
            className="flex size-11 -ml-2 items-center justify-center text-[var(--text-secondary)]"
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.07 } } }}
          className="flex flex-col gap-6"
        >
          {/* (2) Headline con el deseo real (acento recortado a 2-3 palabras) + inversión visible (costo hundido) */}
          <motion.div variants={{ hidden: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0 } }}>
            <h1 className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
              Tu Mapa para <span className="text-[var(--accent)]">{deseoCorto}</span> está listo
            </h1>
            <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
              Hecho con tus {nRespuestas} respuestas.
            </p>
            {/* Línea de pérdida — dolor #1 de FICHA-AVATAR.md, exigida en esta pantalla
             * (57 §9): agita antes de pedir el pago, no solo vende el deseo. */}
            <p className="mt-3 text-[13px] text-[var(--text-secondary)]">
              Sin tu Mapa, sigues con el celular lleno de contactos y nadie a quien llamar un domingo.
            </p>
          </motion.div>

          {/* (4)(5) Plan cards — anual primero en el DOM, pre-seleccionado */}
          <motion.div variants={{ hidden: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col gap-3">
            <PlanCard id="anual" index={0} activo={plan === 'anual'} onClick={() => setPlan('anual')} {...PLANES.anual} />
            <PlanCard id="mensual" index={1} activo={plan === 'mensual'} onClick={() => setPlan('mensual')} {...PLANES.mensual} />
          </motion.div>

          {/* C4 — timeline del trial (el visual default de todo paywall CON trial) */}
          <motion.div variants={{ hidden: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
            <TimelineItem activo index={0} label="Hoy — acceso completo" detalle="Todo tu Mapa, sin límites" />
            <TimelineItem index={1} label="Día 7 — te avisamos" detalle="Correo antes de cualquier cobro" />
            <TimelineItem
              ultimo
              index={2}
              label={`El ${seleccionado.diaCobro.replace('el ', '')} — 1er cobro: ${seleccionado.montoCobro}`}
              detalle="Cancela antes sin costo"
            />
          </motion.div>

          {/* (6) CTA héroe */}
          <motion.div variants={{ hidden: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0 } }}>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/login')}
              className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--bg)] shadow-[0_10px_24px_color-mix(in_oklab,var(--accent)_40%,transparent)] [touch-action:manipulation]"
            >
              Empezar mis 7 días gratis
            </motion.button>
            {/* (7) Reversibilidad — corta a propósito: el timeline de arriba ya es la
                verdad del puente (C4bis prohíbe duplicarla) */}
            <p className="mt-3 text-center text-[13px] text-[var(--text-secondary)]">
              Cancela cuando quieras
            </p>
          </motion.div>

          {/* (8) Salida limpia */}
          <motion.div variants={{ hidden: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0 } }} className="flex items-center justify-center gap-6 text-[16px] font-medium text-[var(--text-secondary)]">
            <button type="button" onClick={() => router.push('/')} className="flex h-11 items-center px-2">
              Ahora no
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => setRestaurarMsg(true)} className="flex h-11 items-center px-2">
              Restaurar compra
            </button>
          </motion.div>
          <AnimatePresence>
            {restaurarMsg && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
                className="-mt-4 text-center text-[13px] text-[var(--text-secondary)]"
              >
                Aún no encontramos una compra tuya con ese correo. Si ya pagaste, escríbenos y te ayudamos.
              </motion.p>
            )}
          </AnimatePresence>

          {/* (9) Trust row */}
          <motion.div variants={{ hidden: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0 } }} className="flex items-center justify-center gap-4 text-[13px] text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5"><Lock size={14} strokeWidth={2} /> Pago seguro con Hotmart</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} strokeWidth={2} /> Garantía 30 días</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function PlanCard({
  activo, index, onClick, nombre, badge, precioMes, totalAnual, ahorro,
}: {
  id: PlanId; activo: boolean; index: number; onClick: () => void; nombre: string; badge: string | null;
  precioMes: string; totalAnual: string | null; ahorro: string | null;
}) {
  // Dispositivo ownable "tarjetas-pegatina" (FICHA-ARTE.md): rotación alternada +
  // sombra direccional, la misma técnica de la landing y del onboarding.
  const rot = index % 2 === 0 ? -2.4 : 2;
  const contenido = (
    <div
      className="relative"
      style={{
        transform: `rotate(${rot}deg)`,
        boxShadow: activo
          ? undefined
          : `${rot > 0 ? 3 : -3}px 7px 16px -9px color-mix(in oklab, var(--text-primary) 30%, transparent)`,
      }}
    >
      {badge && (
        <span className="absolute -top-3 left-4 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-[var(--bg)]">
          {badge}
        </span>
      )}
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={`w-full rounded-[var(--radius-card)] p-4 text-left transition-colors [touch-action:manipulation] ${
          activo
            ? 'bg-[color-mix(in_oklab,var(--accent)_6%,var(--surface))] shadow-[0_14px_28px_-12px_color-mix(in_oklab,var(--accent)_40%,transparent)]'
            : 'border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-semibold text-[var(--text-primary)]">{nombre}</span>
          <span className="text-[22px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
            {precioMes}<span className="text-[13px] font-medium text-[var(--text-secondary)]">/mes</span>
          </span>
        </div>
        {totalAnual && <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{totalAnual}</p>}
        {ahorro && <p className="mt-1 text-[13px] font-semibold text-[var(--accent)]">{ahorro}</p>}
      </motion.button>
    </div>
  );
  return activo ? (
    <Hairline emphasis>{contenido}</Hairline>
  ) : (
    contenido
  );
}

function TimelineItem({
  activo, ultimo, index = 0, label, detalle,
}: { activo?: boolean; ultimo?: boolean; index?: number; label: string; detalle: string }) {
  const reduce = useReducedMotion();
  // Mismo dispositivo ownable que los planes y el onboarding, aplicado sutil al bloque
  // de texto (la línea/puntos se mantienen rectos — son el eje del tiempo).
  const rot = index % 2 === 0 ? -1.8 : 1.6;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className={`size-3 rounded-full ${activo ? 'bg-[var(--accent)]' : 'border-2 border-[var(--text-tertiary)] bg-[var(--bg)]'}`} />
        {!ultimo && (
          <motion.span
            initial={{ scaleY: reduce ? 1 : 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.3 }}
            style={{ transformOrigin: 'top' }}
            className="mt-1 w-px flex-1 bg-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)]"
          />
        )}
      </div>
      <div className="pb-3" style={{ transform: `rotate(${rot}deg)` }}>
        <p className="text-[16px] font-semibold text-[var(--text-primary)]">{label}</p>
        <p className="text-[13px] text-[var(--text-secondary)]">{detalle}</p>
      </div>
    </div>
  );
}
