'use client';

// APP INTERNA — Vínculo (Sesión 5). Sigue 53-PANTALLA-CANONICA.md (composición: header
// contextual + héroe con dato animado + lista con valor + microcopy + nav) y el ritual
// diario M0 de 56-MOMENTOS-EMOCIONALES.md. FICHA-ARTE.md: tarjetas-pegatina, Fredoka/Nunito.
//
// Sin Supabase todavía (Sesión 6): el progreso vive en localStorage con la MISMA forma
// que las tablas reales (route_steps/step_logs de ESTADO.md) — "mockups honestos" (19 §5),
// misma técnica que onboarding/paywall/login. El nombre "Daniela" es dato semilla (32:
// la app nunca se enseña vacía) hasta que el perfil real llegue con la auth de Sesión 6.
//
// Decisión de esta sesión (ESTADO.md): el puente a encuentros reales de Mujer Divina
// (etapa 5, "Abrirte a los demás") queda para V2 — no se construye el envío/invitación
// real todavía, solo se nombra la etapa como destino del camino.

import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from 'motion/react';
import { Bell, Check, Compass, Home as HomeIcon, Lock, LogOut, Map as MapIcon, MessageCircle, Sparkles, User } from 'lucide-react';
import { Hairline, IconChip } from '@/components/landing/ui';
import { leerRespuestas } from '@/components/funnel/storage';
import { ETAPAS, leerRegistro, migrarOnboardingSiHaceFalta, registrarPasoHoy, type EstadoPaso, type RegistroApp } from '@/components/app/storage';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

function CountUp({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const texto = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    const ctrl = animate(mv, value, { duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] });
    return () => ctrl.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <motion.span className="tabular-nums">{texto}</motion.span>;
}

function AnilloEtapa({ etapa, total = 5, size = 84 }: { etapa: number; total?: number; size?: number }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const pct = etapa / total;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`Etapa ${etapa} de ${total}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={8} stroke="color-mix(in oklab, var(--accent) 14%, transparent)" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={8} stroke="var(--accent)" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold tabular-nums text-[var(--text-primary)]">
        {etapa}/{total}
      </span>
    </div>
  );
}

const OPCIONES_CHECKIN: { estado: EstadoPaso; label: string }[] = [
  { estado: 'hecho', label: 'Lo hice' },
  { estado: 'intentado', label: 'Lo intenté' },
  { estado: 'no-pude', label: 'Hoy no pude' },
];

function saludoPorHora(h: number): string {
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function AppVinculo() {
  const router = useRouter();
  const [tab, setTab] = useState<'hoy' | 'mapa' | 'perfil'>('hoy');
  const [registro, setRegistro] = useState<RegistroApp | null>(null);
  const [momentoVacio, setMomentoVacio] = useState('un domingo por la tarde');
  const [errorGuardado, setErrorGuardado] = useState(false);
  const [ultimoIntento, setUltimoIntento] = useState<EstadoPaso | null>(null);
  const [celebrando, setCelebrando] = useState<{ nombre: string } | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.replace('/login');
        return;
      }
      await migrarOnboardingSiHaceFalta();
      setRegistro(await leerRegistro());
      const r = leerRespuestas();
      if (r.momentoVacio) setMomentoVacio(r.momentoVacio.toLowerCase());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ahora = new Date();
  const fechaCruda = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' }).format(ahora);
  const fecha = fechaCruda.charAt(0).toUpperCase() + fechaCruda.slice(1);
  const etapaActual = ETAPAS.find((e) => e.numero === (registro?.etapaActual ?? 1))!;

  const elegirCheckin = async (estado: EstadoPaso) => {
    setUltimoIntento(estado);
    const { registro: nuevo, guardadoOk, subioEtapa } = await registrarPasoHoy(estado);
    setErrorGuardado(!guardadoOk);
    setRegistro(nuevo);
    if (subioEtapa) {
      const siguiente = ETAPAS.find((e) => e.numero === nuevo.etapaActual);
      if (siguiente) {
        setCelebrando({ nombre: siguiente.nombre });
        setTimeout(() => setCelebrando(null), 3200);
      }
    }
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex min-h-dvh flex-col bg-[var(--bg)] [font-family:var(--font-body)]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            'radial-gradient(600px 460px at 6% -6%, color-mix(in oklab, var(--accent) 16%, transparent) 0%, transparent 55%), ' +
            'radial-gradient(520px 420px at 108% 8%, color-mix(in oklab, var(--accent-2) 12%, transparent) 0%, transparent 52%)',
        }}
      />

      <main className="relative z-10 mx-auto w-full max-w-[520px] flex-1 px-4 pt-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            variants={lista}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
          >
            {tab === 'hoy' && (
              <PantallaHoy
                fecha={fecha}
                saludo={saludoPorHora(ahora.getHours())}
                registro={registro}
                etapaActual={etapaActual}
                momentoVacio={momentoVacio}
                errorGuardado={errorGuardado}
                onCheckin={elegirCheckin}
                onReintentar={() => ultimoIntento && elegirCheckin(ultimoIntento)}
                onVerMapa={() => setTab('mapa')}
              />
            )}
            {tab === 'mapa' && <PantallaMapa registro={registro} />}
            {tab === 'perfil' && (
              <PantallaPerfil
                onSalir={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  router.push('/');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Celebración de hito real (subir de etapa) — FICHA-ARTE: "celebrar solo hitos reales" */}
      <AnimatePresence>
        {celebrando && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            role="status"
            aria-live="polite"
            className="fixed inset-x-4 bottom-24 z-20 mx-auto flex max-w-[420px] items-center gap-3 rounded-[var(--radius-card)] border-2 border-[var(--accent)] bg-[var(--surface)] p-4 shadow-[var(--shadow-2)]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
              <Sparkles size={20} color="var(--accent)" aria-hidden="true" />
            </span>
            <p className="text-[14px] font-medium leading-snug text-[var(--text-primary)]">
              Nueva etapa: <span className="font-bold text-[var(--accent)]">{celebrando.nombre}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        aria-label="Navegación principal"
        className="sticky bottom-0 z-10 border-t border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] pb-[max(8px,env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto flex h-16 max-w-[520px] items-stretch justify-around px-2">
          {(
            [
              { id: 'hoy', label: 'Hoy', icono: HomeIcon },
              { id: 'mapa', label: 'Tu Mapa', icono: MapIcon },
              { id: 'perfil', label: 'Perfil', icono: User },
            ] as const
          ).map(({ id, label, icono: Icono }) => {
            const activo = tab === id;
            return (
              <motion.button
                key={id}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setTab(id)}
                aria-current={activo ? 'page' : undefined}
                className="relative flex min-w-16 flex-col items-center justify-center gap-1 [touch-action:manipulation]"
              >
                {activo && (
                  <motion.span
                    layoutId="tab-activa-app"
                    aria-hidden="true"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-[var(--accent)]"
                  />
                )}
                <Icono size={22} aria-hidden="true" color={activo ? 'var(--accent)' : 'var(--text-tertiary)'} strokeWidth={activo ? 2.4 : 2} />
                <span className={`text-[11px] font-medium ${activo ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`}>{label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
    </MotionConfig>
  );
}

function PantallaHoy({
  fecha,
  saludo,
  registro,
  etapaActual,
  momentoVacio,
  errorGuardado,
  onCheckin,
  onReintentar,
  onVerMapa,
}: {
  fecha: string;
  saludo: string;
  registro: RegistroApp | null;
  etapaActual: { numero: number; nombre: string; resumen: string };
  momentoVacio: string;
  errorGuardado: boolean;
  onCheckin: (estado: EstadoPaso) => void;
  onReintentar: () => void;
  onVerMapa: () => void;
}) {
  if (!registro) {
    // ── LOADING: skeleton que espeja la forma real (32/49 §8) ──
    return (
      <div className="flex flex-col gap-6" aria-busy="true">
        <div className="h-14 w-2/3 animate-pulse rounded-[var(--radius-button)] bg-[var(--surface-2)]" />
        <div className="h-56 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
        <div className="h-32 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      </div>
    );
  }

  const TEXTO_PASO_POR_ETAPA: Record<number, string> = {
    1: `Hoy, anota en una frase qué sientes en ${momentoVacio}`,
    2: 'Hoy, date 5 minutos sin celular antes de dormir',
    3: 'Hoy, siéntate 3 minutos en silencio sin llenar el espacio con nada',
    4: 'Hoy, repite el paso que ya se te volvió costumbre esta semana',
    5: 'Hoy, escríbele a alguien que quieras tener más cerca',
  };
  const pasoTitulo = TEXTO_PASO_POR_ETAPA[registro.etapaActual] ?? TEXTO_PASO_POR_ETAPA[2];

  return (
    <>
      <motion.header variants={item} className="mb-6">
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">{fecha}</p>
        <h1 className="mt-1 text-balance text-[30px] font-bold leading-[1.1] tracking-[-0.01em] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {saludo}, Daniela
        </h1>
      </motion.header>

      {/* Objeto principal: el Mapa de Desconexión — dato héroe + next best action */}
      <motion.section variants={item} aria-label="Tu Mapa de Desconexión" className="relative">
        <div
          style={{ transform: 'rotate(-1.4deg)' }}
          className="rounded-[var(--radius-card)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--text-secondary)]">Tu Mapa de Desconexión</p>
              <h2 className="mt-1 text-[22px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
                {etapaActual.nombre}
              </h2>
            </div>
            <AnilloEtapa etapa={etapaActual.numero} />
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--text-secondary)]">{etapaActual.resumen}</p>

          <Hairline emphasis className="mt-5">
            <div className="p-4">
              <p className="text-[15px] font-semibold leading-snug text-[var(--text-primary)]">{pasoTitulo}</p>
              <div className="mt-4 flex flex-col gap-2">
                {OPCIONES_CHECKIN.map((op) => {
                  const activo = registro.pasoHoyEstado === op.estado;
                  return (
                    <motion.button
                      key={op.estado}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onCheckin(op.estado)}
                      className={`flex h-12 w-full items-center justify-between rounded-[var(--radius-button)] px-4 text-[15px] font-medium transition-colors [touch-action:manipulation] ${
                        activo
                          ? 'bg-[var(--accent)] text-[var(--bg)]'
                          : 'border border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] bg-[var(--surface-2)] text-[var(--text-primary)]'
                      }`}
                    >
                      {op.label}
                      {activo && (
                        <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                          <Check size={16} strokeWidth={3} aria-hidden="true" />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              {registro.pasoHoyEstado !== 'pendiente' && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-[13px] text-[var(--text-secondary)]"
                >
                  {registro.pasoHoyEstado === 'no-pude'
                    ? 'Sin culpa — mañana retomas justo donde quedaste.'
                    : 'Anotado en tu Mapa. Mañana vuelve un paso nuevo.'}{' '}
                  Puedes cambiarla cuando quieras.
                </motion.p>
              )}
            </div>
          </Hairline>
        </div>
      </motion.section>

      {/* Vista previa del camino completo — invita a "Tu Mapa" sin duplicar contenido */}
      <motion.section variants={item} className="mt-6">
        <button
          type="button"
          onClick={onVerMapa}
          className="flex w-full items-center justify-between rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)] [touch-action:manipulation]"
        >
          <span className="flex items-center gap-3">
            <IconChip icon={Compass} />
            <span className="text-[14px] font-medium text-[var(--text-primary)]">
              Vas <CountUp value={registro.pasosCompletados} /> {registro.pasosCompletados === 1 ? 'paso' : 'pasos'} en tu camino
            </span>
          </span>
          <span className="text-[13px] font-semibold text-[var(--accent)]">Ver tu Mapa →</span>
        </button>
      </motion.section>

      {errorGuardado && (
        <motion.div variants={item} className="mt-4 flex flex-col items-center gap-2 text-center">
          <p className="text-[13px] text-[var(--color-error)]">
            No pudimos guardar tu registro en este dispositivo — tu progreso podría no verse mañana.
          </p>
          <button type="button" onClick={onReintentar} className="text-[13px] font-semibold text-[var(--accent)] [touch-action:manipulation]">
            Reintentar
          </button>
        </motion.div>
      )}

      <motion.p variants={item} className="mt-6 text-center text-[13px] text-[var(--text-tertiary)]">
        Tu Mapa solo lo ves tú.
      </motion.p>
    </>
  );
}

function PantallaMapa({ registro }: { registro: RegistroApp | null }) {
  const etapaActual = registro?.etapaActual ?? 2;
  return (
    <>
      <motion.header variants={item} className="mb-6">
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Tu camino completo</p>
        <h1 className="mt-1 text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Tu Mapa de Desconexión
        </h1>
      </motion.header>

      <motion.ul variants={item} className="flex flex-col gap-3">
        {ETAPAS.map((e, i) => {
          const estado = e.numero < etapaActual ? 'hecha' : e.numero === etapaActual ? 'actual' : 'bloqueada';
          const rot = i % 2 === 0 ? -1.2 : 1;
          return (
            <motion.li
              key={e.numero}
              variants={item}
              style={{ transform: `rotate(${rot}deg)` }}
              className={`flex items-start gap-4 rounded-[var(--radius-card)] p-4 ${
                estado === 'actual'
                  ? 'bg-[var(--surface)] shadow-[var(--shadow-2)]'
                  : estado === 'hecha'
                    ? 'bg-[var(--surface)] shadow-[var(--shadow-1)]'
                    : 'bg-[color-mix(in_oklab,var(--surface-2)_60%,transparent)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                  estado === 'hecha'
                    ? 'bg-[var(--accent)] text-[var(--bg)]'
                    : estado === 'actual'
                      ? 'border-2 border-[var(--accent)] text-[var(--accent)]'
                      : 'bg-[var(--surface-2)] text-[var(--text-tertiary)]'
                }`}
              >
                {estado === 'hecha' ? <Check size={16} strokeWidth={3} /> : estado === 'bloqueada' ? <Lock size={14} /> : e.numero}
              </span>
              <div className="min-w-0">
                <p className={`text-[15px] font-semibold ${estado === 'bloqueada' ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'}`}>
                  {e.nombre}
                </p>
                <p className={`mt-0.5 text-[13px] leading-snug ${estado === 'bloqueada' ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-secondary)]'}`}>
                  {e.resumen}
                </p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>

      <motion.p variants={item} className="mt-6 text-center text-[13px] text-[var(--text-tertiary)]">
        Cada etapa se gana por avance real, no por calendario.
      </motion.p>
    </>
  );
}

function PantallaPerfil({ onSalir }: { onSalir: () => void }) {
  const [notificaciones, setNotificaciones] = useState(true);
  return (
    <>
      <motion.header variants={item} className="mb-6 flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-[var(--accent)] text-[24px] font-bold text-[var(--bg)] [font-family:var(--font-display)]">
          D
        </span>
        <h1 className="mt-3 text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Daniela</h1>
        <p className="text-[13px] text-[var(--text-tertiary)]">Plan Anual · activo</p>
      </motion.header>

      <motion.ul variants={item} className="flex flex-col gap-2">
        <li className="flex items-center justify-between gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]">
          <span className="flex items-start gap-3">
            <IconChip icon={Bell} />
            <span>
              <span className="block text-[15px] font-medium text-[var(--text-primary)]">Notificaciones</span>
              <span className="block text-[13px] text-[var(--text-secondary)]">Tu recordatorio diario</span>
            </span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={notificaciones}
            aria-label="Notificaciones — tu recordatorio diario"
            onClick={() => setNotificaciones((v) => !v)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors [touch-action:manipulation] ${
              notificaciones ? 'bg-[var(--accent)]' : 'bg-[var(--surface-2)]'
            }`}
          >
            <motion.span
              layout
              transition={{ duration: 0.15 }}
              className="absolute top-1 size-5 rounded-full bg-[var(--bg)] shadow-[var(--shadow-1)]"
              style={{ left: notificaciones ? 24 : 4 }}
            />
          </button>
        </li>
        <a
          href="mailto:hola@vinculo.app"
          className="flex items-center gap-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[var(--shadow-1)]"
        >
          <IconChip icon={MessageCircle} />
          <span>
            <span className="block text-[15px] font-medium text-[var(--text-primary)]">Ayuda y soporte</span>
            <span className="block text-[13px] text-[var(--text-secondary)]">Escríbenos si algo no funciona</span>
          </span>
        </a>
      </motion.ul>

      <motion.button
        variants={item}
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={onSalir}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] text-[15px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
      >
        <LogOut size={18} aria-hidden="true" />
        Cerrar sesión
      </motion.button>

      <motion.p variants={item} className="mt-6 text-center text-[13px] text-[var(--text-tertiary)]">
        Tus datos son privados. Puedes borrarlos cuando quieras desde soporte.
      </motion.p>
    </>
  );
}
