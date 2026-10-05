'use client';

// PAYWALL — Vínculo. Sigue 50-DISENO-ONBOARDING-PAYWALL.md → C1 (blueprint) + C4
// (qué incluye + garantía; SIN prueba gratis desde 2026-10-05). Copy derivado de FICHA-AVATAR.md
// (57 §9): headline con el deseo #1, línea de pérdida con el dolor #1, CTA en 1ª
// persona, garantía con plazo real (FICHA-MERCADO §4).
//
// Precio y trial: FICHA-MERCADO.md §1/§4 + ESTADO.md → Estrategia de monetización.
// El CTA aún no lleva al checkout real de Hotmart (falta el link de cada plan) —
// por ahora va a /login (pendiente: conectar el link de pago y gatear /app por status).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X, ShieldCheck, Lock, Check } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';
import { FondoFunnel, FunnelCta } from '@/components/funnel/ui';
import { leerRespuestasTest } from '@/components/funnel/storage';
import { calcularResultado, categoriaMasDebil, CATEGORIAS, type Categoria } from '@/lib/test-vinculo';

type PlanId = 'anual' | 'mensual';

// Línea de pérdida (dolor real, FICHA-AVATAR.md) — una por categoría, eco de la
// misma frase que ya vio en "¿Te suena?" de la landing, para que la pantalla de
// planes se sienta escrita PARA su resultado, no genérica (50-DISENO-ONBOARDING-PAYWALL).
const FRASE_PERDIDA: Record<Categoria, string> = {
  contigo: 'Sin tu Mapa, sigues con tardes a solas sintiendo que te falta algo.',
  familia: 'Sin tu Mapa, sigues sin hablar con tu familia de lo que de verdad importa.',
  amistad: 'Sin tu Mapa, sigues sin nadie a quien llamar sin pensarlo dos veces.',
  comunidad: 'Sin tu Mapa, sigues sintiendo que no perteneces a ningún grupo.',
  proposito: 'Sin tu Mapa, sigues sin que lo que haces día a día te haga sentido.',
};

const PLANES = {
  anual: {
    nombre: 'Anual', badge: 'MEJOR VALOR', precioMes: '$4.17',
    totalAnual: 'Se cobra US$49.99/año', ahorro: 'Más de la mitad de descuento vs. mensual',
  },
  mensual: {
    nombre: 'Mensual', badge: null, precioMes: '$8.99',
    totalAnual: null, ahorro: null,
  },
} as const;

const INCLUYE = [
  'Tu Camino completo, etapa por etapa',
  'Prácticas guiadas nuevas cada semana',
  'Tu Mapa actualizado con tu progreso',
  'Plan de regreso si te alejas, sin culpa',
];

export default function Paywall() {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanId>('anual');
  const [nRespuestas, setNRespuestas] = useState(12);
  const [categoriaDebil, setCategoriaDebil] = useState<Categoria>('contigo');
  const [restaurarMsg, setRestaurarMsg] = useState(false);

  useEffect(() => {
    const r = leerRespuestasTest();
    const n = Object.keys(r).length;
    if (n > 0) {
      setNRespuestas(n);
      setCategoriaDebil(categoriaMasDebil(calcularResultado(r)).categoria);
    }
  }, []);

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
              Tu Mapa para <span className="italic text-[var(--accent)]">{CATEGORIAS[categoriaDebil].nombre}</span> está listo
            </h1>
            <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
              Hecho con tus {nRespuestas} respuestas.
            </p>
            {/* Línea de pérdida — dolor real de FICHA-AVATAR.md, atada a la categoría más
             * débil del test (50-DISENO-ONBOARDING-PAYWALL): agita antes de pedir el pago. */}
            <p className="mt-3 text-[13px] text-[var(--text-secondary)]">{FRASE_PERDIDA[categoriaDebil]}</p>
          </motion.div>

          {/* (4)(5) Plan cards — anual primero en el DOM, pre-seleccionado */}
          <motion.div variants={{ hidden: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col gap-3">
            <PlanCard id="anual" index={0} activo={plan === 'anual'} onClick={() => setPlan('anual')} {...PLANES.anual} />
            <PlanCard id="mensual" index={1} activo={plan === 'mensual'} onClick={() => setPlan('mensual')} {...PLANES.mensual} />
          </motion.div>

          {/* Qué incluye — pago directo (sin prueba gratis): el Mapa ya se entregó, esto es lo que se desbloquea */}
          <motion.ul variants={{ hidden: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4">
            {INCLUYE.map((t) => (
              <li key={t} className="flex items-start gap-3 text-[15px] text-[var(--text-primary)]">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
                  <Check size={12} strokeWidth={3} color="var(--accent)" aria-hidden="true" />
                </span>
                {t}
              </li>
            ))}
          </motion.ul>

          {/* (6) CTA héroe — píldora "tinta" (FICHA-ARTE v2: el acento no es fondo de botón) */}
          <motion.div variants={{ hidden: { opacity: 0, y: reduce ? 0 : 16 }, visible: { opacity: 1, y: 0 } }}>
            <FunnelCta onClick={() => router.push('/login')}>Empezar mi Camino</FunnelCta>
            {/* (7) Reversibilidad: garantía real de 30 días (FICHA-MERCADO §4, sin prueba gratis) */}
            <p className="mt-3 text-center text-[13px] text-[var(--text-secondary)]">
              Garantía de 30 días: si no sientes avance, te devolvemos todo
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
  const contenido = (
    <div
      className="relative"
      style={{
        boxShadow: activo ? undefined : '0 6px 14px -9px color-mix(in oklab, var(--text-primary) 26%, transparent)',
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
