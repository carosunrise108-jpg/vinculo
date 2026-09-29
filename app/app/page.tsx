'use client';

// APP INTERNA — Vínculo, rebrand v2 (2026-09-29). Sigue FICHA-ARTE.md → "Producto y voz":
// nav Hoy · Camino · Mapa · Diario (Perfil se retira de la nav; su contenido —
// notificaciones y cerrar sesión— vive ahora en Diario). Práctica NO es una pestaña:
// se abre desde el paso de hoy (pantalla completa, modo oscuro "Amanecer").
//
// Datos: Supabase real (Sesión 6). El Mapa de conexión se lee de onboarding_responses
// (respuestas del test nuevo, ver components/app/storage.ts → leerResultadoMapa).

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
import { Bell, Check, Compass, Home as HomeIcon, Lock, LogOut, Map as MapIcon, MessageCircle, NotebookText, Pause, Play, X } from 'lucide-react';
import { Hairline, IconChip } from '@/components/landing/ui';
import { VinculoSimbolo } from '@/components/brand/simbolo';
import { MapaConexion, LeyendaMapa } from '@/components/brand/mapa-conexion';
import {
  ETAPAS,
  leerRegistro,
  leerResultadoMapa,
  migrarOnboardingSiHaceFalta,
  registrarPasoHoy,
  categoriaMasDebil,
  type EstadoPaso,
  type RegistroApp,
} from '@/components/app/storage';
import type { ResultadoCategoria } from '@/lib/test-vinculo';
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

type Tab = 'hoy' | 'camino' | 'mapa' | 'diario';

export default function AppVinculo() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('hoy');
  const [practicaAbierta, setPracticaAbierta] = useState(false);
  const [registro, setRegistro] = useState<RegistroApp | null>(null);
  const [resultadoMapa, setResultadoMapa] = useState<ResultadoCategoria[] | null | 'cargando'>('cargando');
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
      setResultadoMapa(await leerResultadoMapa());
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

  if (practicaAbierta) {
    return (
      <PantallaPractica
        etapa={etapaActual}
        onCerrar={() => setPracticaAbierta(false)}
        onTerminar={async () => {
          await elegirCheckin('hecho');
          setPracticaAbierta(false);
        }}
      />
    );
  }

  return (
    <MotionConfig reducedMotion="user">
    <div className="flex min-h-dvh flex-col bg-[var(--bg)] [font-family:var(--font-body)]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            'radial-gradient(600px 460px at 6% -6%, color-mix(in oklab, var(--accent) 14%, transparent) 0%, transparent 55%), ' +
            'radial-gradient(520px 420px at 108% 8%, color-mix(in oklab, var(--accent-2) 20%, transparent) 0%, transparent 52%)',
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
                errorGuardado={errorGuardado}
                onCheckin={elegirCheckin}
                onReintentar={() => ultimoIntento && elegirCheckin(ultimoIntento)}
                onEmpezarPractica={() => setPracticaAbierta(true)}
                onVerCamino={() => setTab('camino')}
              />
            )}
            {tab === 'camino' && <PantallaCamino registro={registro} />}
            {tab === 'mapa' && <PantallaMapa resultado={resultadoMapa} />}
            {tab === 'diario' && (
              <PantallaDiario
                registro={registro}
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
              <VinculoSimbolo size={18} color="var(--accent)" />
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
              { id: 'camino', label: 'Camino', icono: Compass },
              { id: 'mapa', label: 'Mapa', icono: MapIcon },
              { id: 'diario', label: 'Diario', icono: NotebookText },
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

export function PantallaHoy({
  fecha,
  saludo,
  registro,
  etapaActual,
  errorGuardado,
  onCheckin,
  onReintentar,
  onEmpezarPractica,
  onVerCamino,
}: {
  fecha: string;
  saludo: string;
  registro: RegistroApp | null;
  etapaActual: (typeof ETAPAS)[number];
  errorGuardado: boolean;
  onCheckin: (estado: EstadoPaso) => void;
  onReintentar: () => void;
  onEmpezarPractica: () => void;
  onVerCamino: () => void;
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

  return (
    <>
      <motion.header variants={item} className="mb-6">
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">{fecha}</p>
        <h1 className="mt-1 text-balance text-[30px] font-bold leading-[1.1] tracking-[-0.01em] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {saludo}
        </h1>
      </motion.header>

      {/* Objeto principal: la práctica de hoy — dato héroe + next best action */}
      <motion.section variants={item} aria-label="Tu práctica de hoy" className="relative">
        <div className="rounded-[var(--radius-card)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--text-secondary)]">Tu Camino · {etapaActual.nombre}</p>
              <h2 className="mt-1 text-[22px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
                {etapaActual.practica.titulo}
              </h2>
              <p className="mt-1 text-[13px] text-[var(--text-tertiary)]">{etapaActual.practica.duracion}</p>
            </div>
            <AnilloEtapa etapa={etapaActual.numero} />
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--text-secondary)]">{etapaActual.resumen}</p>

          <button
            type="button"
            onClick={onEmpezarPractica}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--text-primary)] text-[15px] font-semibold text-[var(--surface)] [touch-action:manipulation]"
          >
            <Play size={16} fill="currentColor" aria-hidden="true" /> Empezar práctica
          </button>

          <Hairline emphasis className="mt-5">
            <div className="p-4">
              <p className="text-[14px] font-semibold leading-snug text-[var(--text-primary)]">¿Cómo te fue hoy?</p>
              <div className="mt-3 flex flex-col gap-2">
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
                          ? 'bg-[var(--accent)] text-[var(--surface)]'
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
                    : 'Anotado en tu Camino. Mañana vuelve un paso nuevo.'}{' '}
                  Puedes cambiarlo cuando quieras.
                </motion.p>
              )}
            </div>
          </Hairline>
        </div>
      </motion.section>

      <motion.section variants={item} className="mt-6">
        <button
          type="button"
          onClick={onVerCamino}
          className="flex w-full items-center justify-between rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-left shadow-[var(--shadow-1)] [touch-action:manipulation]"
        >
          <span className="flex items-center gap-3">
            <IconChip icon={Compass} />
            <span className="text-[14px] font-medium text-[var(--text-primary)]">
              Vas <CountUp value={registro.pasosCompletados} /> {registro.pasosCompletados === 1 ? 'paso' : 'pasos'} en tu Camino
            </span>
          </span>
          <span className="text-[13px] font-semibold text-[var(--accent)]">Ver tu Camino →</span>
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
        Primero tú. Luego, nosotros.
      </motion.p>
    </>
  );
}

export function PantallaCamino({ registro }: { registro: RegistroApp | null }) {
  const etapaActual = registro?.etapaActual ?? 1;
  return (
    <>
      <motion.header variants={item} className="mb-6">
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Tu proceso completo</p>
        <h1 className="mt-1 text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Tu Camino
        </h1>
      </motion.header>

      <motion.ul variants={item} className="flex flex-col gap-3">
        {ETAPAS.map((e) => {
          const estado = e.numero < etapaActual ? 'hecha' : e.numero === etapaActual ? 'actual' : 'bloqueada';
          return (
            <motion.li
              key={e.numero}
              variants={item}
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
                    ? 'bg-[var(--accent)] text-[var(--surface)]'
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

export function PantallaMapa({ resultado }: { resultado: ResultadoCategoria[] | null | 'cargando' }) {
  if (resultado === 'cargando') {
    return (
      <div className="flex flex-col gap-6" aria-busy="true">
        <div className="h-10 w-1/2 animate-pulse rounded-[var(--radius-button)] bg-[var(--surface-2)]" />
        <div className="h-[300px] w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="flex flex-col items-center gap-3 pt-16 text-center">
        <IconChip icon={MapIcon} tone="muted" />
        <p className="text-[15px] text-[var(--text-secondary)]">Todavía no tenemos tu Mapa. Responde tu test para verlo aquí.</p>
      </div>
    );
  }

  const debil = categoriaMasDebil(resultado);
  return (
    <>
      <motion.header variants={item} className="mb-6">
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Actualizado con tu progreso</p>
        <h1 className="mt-1 text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Tu Mapa <span className="italic text-[var(--accent)]">de conexión</span>
        </h1>
      </motion.header>

      <motion.div variants={item}>
        <MapaConexion resultado={resultado} />
      </motion.div>
      <motion.div variants={item}>
        <LeyendaMapa />
      </motion.div>

      <motion.div variants={item} className="mt-5 flex flex-col gap-2 rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">
        <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">Tu foco actual</span>
        <p className="text-[18px] leading-[1.3] [font-family:var(--font-display)]">
          <span className="italic">{debil.categoria === 'contigo' ? 'Contigo' : `Con tu ${debil.categoria}`}</span> es lo que más espacio pide hoy.
        </p>
      </motion.div>

      <motion.p variants={item} className="mt-6 text-center text-[13px] text-[var(--text-tertiary)]">
        Tu Mapa solo lo ves tú.
      </motion.p>
    </>
  );
}

export function PantallaDiario({ registro, onSalir }: { registro: RegistroApp | null; onSalir: () => void }) {
  const [notificaciones, setNotificaciones] = useState(true);
  const estadoHoy = registro?.pasoHoyEstado ?? 'pendiente';
  const TEXTO_ESTADO: Record<EstadoPaso, string> = {
    hecho: 'Hoy lo hiciste.',
    intentado: 'Hoy lo intentaste.',
    'no-pude': 'Hoy no pudiste — sin culpa.',
    pendiente: 'Todavía no registras el día de hoy.',
  };

  return (
    <>
      <motion.header variants={item} className="mb-6">
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Tu espacio</p>
        <h1 className="mt-1 text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">Diario</h1>
      </motion.header>

      <motion.div variants={item} className="flex items-center gap-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
          <VinculoSimbolo size={22} color="var(--accent)" />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[var(--text-primary)]">{TEXTO_ESTADO[estadoHoy]}</p>
          <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
            Llevas <span className="font-semibold text-[var(--text-primary)]">{registro?.pasosCompletados ?? 0}</span>{' '}
            {(registro?.pasosCompletados ?? 0) === 1 ? 'paso' : 'pasos'} en total.
          </p>
        </div>
      </motion.div>

      <motion.ul variants={item} className="mt-4 flex flex-col gap-2">
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
              className="absolute top-1 size-5 rounded-full bg-[var(--surface)] shadow-[var(--shadow-1)]"
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

// Práctica guiada — pantalla completa, modo oscuro "Amanecer" (FICHA-ARTE v2: junto con
// Bienvenida, las 2 pantallas de mayor introspección). Sin audio real todavía (pendiente
// de la usuaria) — el reproductor es una interfaz honesta sin conexión a un archivo real.
export function PantallaPractica({
  etapa,
  onCerrar,
  onTerminar,
}: {
  etapa: (typeof ETAPAS)[number];
  onCerrar: () => void;
  onTerminar: () => void;
}) {
  const [reproduciendo, setReproduciendo] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden px-6 pt-6 pb-10 [font-family:var(--font-body)]"
      style={{ background: 'var(--gradient-amanecer)', color: 'var(--surface)' }}
    >
      <div className="flex h-14 items-center justify-between">
        <span className="text-[13px] font-medium uppercase tracking-[0.16em]" style={{ color: 'color-mix(in oklab, var(--surface) 75%, transparent)' }}>
          Práctica guiada
        </span>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar práctica"
          className="flex size-11 -mr-2 items-center justify-center"
        >
          <X size={20} strokeWidth={2.2} color="var(--surface)" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <motion.div
          aria-hidden="true"
          animate={reduce ? {} : { scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex size-40 items-center justify-center rounded-full"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--accent-2) 55%, transparent) 0%, color-mix(in oklab, var(--accent-3) 35%, transparent) 55%, transparent 78%)',
          }}
        >
          <VinculoSimbolo size={48} color="var(--surface)" />
        </motion.div>

        <div className="text-center">
          <h1 className="text-[26px] leading-[1.15] [font-family:var(--font-display)]">{etapa.practica.titulo}</h1>
          <p className="mt-2 text-[14px]" style={{ color: 'color-mix(in oklab, var(--surface) 75%, transparent)' }}>
            {etapa.practica.duracion} · Etapa {etapa.nombre}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReproduciendo((v) => !v)}
          aria-label={reproduciendo ? 'Pausar' : 'Reproducir'}
          className="flex size-16 items-center justify-center rounded-full [touch-action:manipulation]"
          style={{ background: 'var(--surface)' }}
        >
          {reproduciendo ? (
            <Pause size={24} strokeWidth={2.4} color="var(--text-primary)" fill="var(--text-primary)" />
          ) : (
            <Play size={24} strokeWidth={2.4} color="var(--text-primary)" fill="var(--text-primary)" />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onTerminar}
          className="flex h-[52px] w-full items-center justify-center rounded-[var(--radius-pill)] text-[16px] font-semibold [touch-action:manipulation]"
          style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
        >
          Ya terminé
        </button>
        <p className="text-center text-[13px]" style={{ color: 'color-mix(in oklab, var(--surface) 70%, transparent)' }}>
          Puedes salir cuando quieras — nada se pierde.
        </p>
      </div>
    </div>
  );
}
