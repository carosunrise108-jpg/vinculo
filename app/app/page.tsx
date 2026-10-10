'use client';

// APP INTERNA — Vínculo, rebrand v2 (2026-09-29). Sigue FICHA-ARTE.md → "Producto y voz":
// nav Hoy · Camino · Mapa · Diario (Perfil se retira de la nav; su contenido —
// notificaciones y cerrar sesión— vive ahora en Diario). Práctica NO es una pestaña:
// se abre desde el paso de hoy (pantalla completa, modo oscuro "Amanecer").
//
// Datos: Supabase real (Sesión 6). El Mapa de conexión se lee de onboarding_responses
// (respuestas del test nuevo, ver components/app/storage.ts → leerResultadoMapa).

import { useEffect, useRef, useState } from 'react';
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
import { CartaConexion } from '@/components/brand/carta-conexion';
import {
  ETAPAS,
  leerRegistro,
  leerResultadoMapa,
  migrarOnboardingSiHaceFalta,
  registrarPasoHoy,
  categoriaMasDebil,
  guardarEntradaDiario,
  leerEntradasDiario,
  type EntradaDiario,
  type EstadoPaso,
  type RegistroApp,
} from '@/components/app/storage';
import type { ResultadoCategoria } from '@/lib/test-vinculo';
import {
  ETAPAS_DISPONIBLES,
  NOTA_NO_TERAPIA,
  PRACTICAS,
  practicaDe,
  practicasDeEtapa,
  type Practica,
  type TipoPractica,
} from '@/lib/practicas';
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
  const [entradas, setEntradas] = useState<EntradaDiario[] | null>(null);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const [ultimoIntento, setUltimoIntento] = useState<EstadoPaso | null>(null);
  const [celebrando, setCelebrando] = useState<string | null>(null);

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
      setEntradas(await leerEntradasDiario());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ahora = new Date();
  const fechaCruda = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' }).format(ahora);
  const fecha = fechaCruda.charAt(0).toUpperCase() + fechaCruda.slice(1);
  const etapaActual = ETAPAS.find((e) => e.numero === (registro?.etapaActual ?? 1))!;
  const practica = registro ? practicaDe(registro.etapaActual, registro.practicaActual) : null;

  const elegirCheckin = async (estado: EstadoPaso) => {
    setUltimoIntento(estado);
    const { registro: nuevo, guardadoOk, completoVuelta } = await registrarPasoHoy(estado);
    setErrorGuardado(!guardadoOk);
    setRegistro(nuevo);
    if (completoVuelta) {
      setCelebrando(`Completaste una vuelta de ${etapaActual.nombre}. Puedes volver a recorrerla, cada vez más profundo.`);
      setTimeout(() => setCelebrando(null), 4600);
    }
  };

  if (practicaAbierta && practica && registro) {
    return (
      <PantallaPractica
        practica={practica}
        etapa={etapaActual}
        vuelta={registro.vuelta}
        onCerrar={() => setPracticaAbierta(false)}
        onTerminar={async (textos) => {
          for (const t of textos) {
            await guardarEntradaDiario({
              practica_id: practica.id,
              etapa: practica.etapa,
              vuelta: registro.vuelta,
              pregunta: t.pregunta,
              texto: t.texto,
            });
          }
          if (textos.length > 0) setEntradas(await leerEntradasDiario());
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
                practica={practica}
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
                entradas={entradas}
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

      {/* Celebración de hito real (completar una vuelta) — FICHA-ARTE: "celebrar solo hitos reales" */}
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
            <p className="text-[14px] font-medium leading-snug text-[var(--text-primary)]">{celebrando}</p>
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

const ETIQUETA_TIPO: Record<TipoPractica, string> = {
  audio: 'Audio guiado',
  accion: 'Práctica guiada',
  escritura: 'Escritura',
};

export function PantallaHoy({
  fecha,
  saludo,
  registro,
  etapaActual,
  practica,
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
  practica: Practica | null;
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

  const hechaHoy = registro.pasoHoyEstado === 'hecho';
  const total = practicasDeEtapa(etapaActual.numero).length || 1;

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
              <p className="text-[13px] font-medium text-[var(--text-secondary)]">
                Tu Camino · {etapaActual.nombre}
                {registro.vuelta > 1 ? ` · vuelta ${registro.vuelta}` : ''}
              </p>
              {practica ? (
                <>
                  <h2 className="mt-1 text-[22px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
                    {practica.titulo}
                  </h2>
                  <p className="mt-1 text-[13px] text-[var(--text-tertiary)]">
                    {ETIQUETA_TIPO[practica.tipo]} · {practica.duracion} · {practica.numero} de {total}
                  </p>
                </>
              ) : (
                <h2 className="mt-1 text-[22px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
                  Tu próxima práctica llega pronto
                </h2>
              )}
            </div>
            <AnilloEtapa etapa={etapaActual.numero} />
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-[var(--text-secondary)]">{etapaActual.resumen}</p>

          {practica && (
            <button
              type="button"
              onClick={onEmpezarPractica}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--text-primary)] text-[15px] font-semibold text-[var(--surface)] [touch-action:manipulation]"
            >
              <Play size={16} fill="currentColor" aria-hidden="true" /> {hechaHoy ? 'Volver a hacerla' : 'Empezar práctica'}
            </button>
          )}

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
                  {registro.pasoHoyEstado === 'hecho'
                    ? 'Anotado en tu Camino. Mañana te espera la siguiente práctica.'
                    : 'Sin culpa — mañana retomas esta misma práctica, justo donde quedaste.'}{' '}
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
              Llevas <CountUp value={registro.pasosCompletados} /> {registro.pasosCompletados === 1 ? 'práctica' : 'prácticas'} en tu Camino
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
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Tu proceso, sin final</p>
        <h1 className="mt-1 text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Tu Camino
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
          No es una escalera que se termina: es una espiral. Cada etapa se puede volver a recorrer, y cada vuelta te lleva un poco más hondo.
        </p>
      </motion.header>

      <motion.ul variants={item} className="flex flex-col gap-3">
        {ETAPAS.map((e) => {
          const disponible = ETAPAS_DISPONIBLES.has(e.numero);
          const actual = e.numero === etapaActual && disponible;
          const total = practicasDeEtapa(e.numero).length;
          return (
            <motion.li
              key={e.numero}
              variants={item}
              className={`flex items-start gap-4 rounded-[var(--radius-card)] p-4 ${
                actual
                  ? 'bg-[var(--surface)] shadow-[var(--shadow-2)]'
                  : disponible
                    ? 'bg-[var(--surface)] shadow-[var(--shadow-1)]'
                    : 'bg-[color-mix(in_oklab,var(--surface-2)_60%,transparent)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                  actual
                    ? 'border-2 border-[var(--accent)] text-[var(--accent)]'
                    : disponible
                      ? 'bg-[var(--accent)] text-[var(--surface)]'
                      : 'bg-[var(--surface-2)] text-[var(--text-tertiary)]'
                }`}
              >
                {disponible ? e.numero : <Lock size={14} />}
              </span>
              <div className="min-w-0">
                <p className={`text-[15px] font-semibold ${disponible ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                  {e.nombre}
                  {!disponible && <span className="ml-2 text-[12px] font-medium">Pronto</span>}
                </p>
                <p className={`mt-0.5 text-[13px] leading-snug ${disponible ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)]'}`}>
                  {e.resumen}
                </p>
                {actual && registro && (
                  <p className="mt-2 text-[13px] font-medium text-[var(--accent)]">
                    Vuelta {registro.vuelta} · práctica {registro.practicaActual} de {total}
                  </p>
                )}
              </div>
            </motion.li>
          );
        })}
      </motion.ul>

      <motion.p variants={item} className="mt-6 text-center text-[13px] text-[var(--text-tertiary)]">
        Las demás etapas se abren cuando estén listas. Mientras tanto, la Quietud siempre tiene más hondura.
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

      <motion.div variants={item} className="mt-5">
        <CartaConexion categoria={debil.categoria} />
      </motion.div>

      <motion.p variants={item} className="mt-6 text-center text-[13px] text-[var(--text-tertiary)]">
        Tu Mapa solo lo ves tú.
      </motion.p>
    </>
  );
}


export function PantallaDiario({
  registro,
  entradas,
  onSalir,
}: {
  registro: RegistroApp | null;
  entradas: EntradaDiario[] | null;
  onSalir: () => void;
}) {
  const [notificaciones, setNotificaciones] = useState(true);
  const estadoHoy = registro?.pasoHoyEstado ?? 'pendiente';
  const TEXTO_ESTADO: Record<EstadoPaso, string> = {
    hecho: 'Hoy lo hiciste.',
    intentado: 'Hoy lo intentaste.',
    'no-pude': 'Hoy no pudiste — sin culpa.',
    pendiente: 'Todavía no registras el día de hoy.',
  };
  const formatoFecha = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' });

  return (
    <>
      <motion.header variants={item} className="mb-6">
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Solo para ti</p>
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
            {(registro?.pasosCompletados ?? 0) === 1 ? 'práctica' : 'prácticas'} en total.
          </p>
        </div>
      </motion.div>

      <motion.section variants={item} className="mt-6" aria-label="Tus entradas">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">Lo que has escrito</h2>
        {entradas === null ? (
          <div className="mt-3 flex flex-col gap-3" aria-busy="true">
            <div className="h-28 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
            <div className="h-28 w-full animate-pulse rounded-[var(--radius-card)] bg-[var(--surface-2)]" />
          </div>
        ) : entradas.length === 0 ? (
          <div className="mt-3 rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">
            <p className="text-[18px] italic leading-snug text-[var(--text-primary)] [font-family:var(--font-display)]">
              Aquí vivirá lo que escribas después de cada práctica.
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              Es tu espacio íntimo: nadie más lo ve. Cuando termines tu primera práctica, tu primera entrada aparecerá aquí.
            </p>
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {entradas.map((e) => {
              const p = PRACTICAS.find((x) => x.id === e.practica_id);
              return (
                <li key={e.id} className="rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">
                  <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    {formatoFecha.format(new Date(e.created_at))} · {p?.titulo ?? 'Práctica'}
                    {e.vuelta > 1 ? ` · vuelta ${e.vuelta}` : ''}
                  </p>
                  {e.pregunta && (
                    <p className="mt-2 text-[15px] italic leading-snug text-[var(--text-secondary)] [font-family:var(--font-display)]">
                      {e.pregunta}
                    </p>
                  )}
                  <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--text-primary)]">{e.texto}</p>
                </li>
              );
            })}
          </ul>
        )}
      </motion.section>

      <motion.ul variants={item} className="mt-6 flex flex-col gap-2">
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

// ── PRÁCTICA: ANTES (para qué es) → LA PRÁCTICA (audio / acción / escritura) → DESPUÉS (introspección + Diario) ──

function formatoMinutos(seg: number): string {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function ReproductorAudio({ clave, etiqueta }: { clave: string; etiqueta: string }) {
  const [estado, setEstado] = useState<'idle' | 'cargando' | 'listo' | 'sin-audio' | 'sin-acceso' | 'error'>('idle');
  const [url, setUrl] = useState<string | null>(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (url && audioRef.current) audioRef.current.play().catch(() => setEstado('error'));
  }, [url]);

  const alternar = async () => {
    const a = audioRef.current;
    if (url && a) {
      if (a.paused) a.play().catch(() => setEstado('error'));
      else a.pause();
      return;
    }
    setEstado('cargando');
    try {
      const r = await fetch(`/api/practicas/audio?clave=${encodeURIComponent(clave)}`);
      if (r.status === 404) return setEstado('sin-audio');
      if (r.status === 401 || r.status === 403) return setEstado('sin-acceso');
      if (!r.ok) return setEstado('error');
      const { url: firmada } = (await r.json()) as { url: string };
      setUrl(firmada);
      setEstado('listo');
    } catch {
      setEstado('error');
    }
  };

  const MENSAJE: Partial<Record<typeof estado, string>> = {
    'sin-audio': 'Este audio todavía no está disponible. Mientras tanto, puedes quedarte en silencio unos minutos con lo que acabas de leer.',
    'sin-acceso': 'Para escuchar este audio necesitas una suscripción activa.',
    error: 'No pudimos reproducir el audio. Revisa tu conexión e inténtalo de nuevo.',
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <audio
        ref={audioRef}
        src={url ?? undefined}
        preload="none"
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
        onEnded={() => {
          setReproduciendo(false);
          setProgreso(1);
        }}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (el.duration) setProgreso(el.currentTime / el.duration);
        }}
      />
      <button
        type="button"
        onClick={alternar}
        disabled={estado === 'cargando'}
        aria-label={reproduciendo ? `Pausar: ${etiqueta}` : `Reproducir: ${etiqueta}`}
        className="flex size-16 items-center justify-center rounded-full bg-[var(--surface)] [touch-action:manipulation] disabled:opacity-60"
      >
        {reproduciendo ? (
          <Pause size={24} strokeWidth={2.4} color="var(--text-primary)" fill="var(--text-primary)" />
        ) : (
          <Play size={24} strokeWidth={2.4} color="var(--text-primary)" fill="var(--text-primary)" />
        )}
      </button>
      <p className="text-[13px]" style={{ color: 'color-mix(in oklab, var(--surface) 75%, transparent)' }}>
        {estado === 'cargando' ? 'Preparando tu audio…' : etiqueta}
      </p>
      {estado === 'listo' && (
        <div className="h-1 w-full max-w-[260px] overflow-hidden rounded-full" style={{ background: 'color-mix(in oklab, var(--surface) 25%, transparent)' }}>
          <div className="h-full rounded-full bg-[var(--surface)] transition-[width] duration-300" style={{ width: `${Math.round(progreso * 100)}%` }} />
        </div>
      )}
      {MENSAJE[estado] && (
        <p role="status" className="max-w-[300px] text-center text-[13px] leading-snug" style={{ color: 'color-mix(in oklab, var(--surface) 85%, transparent)' }}>
          {MENSAJE[estado]}
        </p>
      )}
    </div>
  );
}

function TemporizadorPractica({ minutos }: { minutos: number }) {
  const total = minutos * 60;
  const [restante, setRestante] = useState(total);
  const [corriendo, setCorriendo] = useState(false);

  useEffect(() => {
    if (!corriendo) return;
    const id = setInterval(() => {
      setRestante((r) => {
        if (r <= 1) {
          setCorriendo(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [corriendo]);

  const terminado = restante === 0;
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[44px] leading-none tabular-nums [font-family:var(--font-display)]" aria-live="off">
        {formatoMinutos(restante)}
      </p>
      {terminado ? (
        <p role="status" className="text-[14px]" style={{ color: 'color-mix(in oklab, var(--surface) 85%, transparent)' }}>
          Tu tiempo terminó. Gracias por regalártelo.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => setCorriendo((c) => !c)}
          className="flex h-11 items-center rounded-[var(--radius-pill)] px-6 text-[14px] font-semibold [touch-action:manipulation]"
          style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
        >
          {corriendo ? 'Pausar' : restante === total ? 'Empezar mi tiempo' : 'Seguir'}
        </button>
      )}
    </div>
  );
}

export function PantallaPractica({
  practica,
  etapa,
  vuelta,
  onCerrar,
  onTerminar,
}: {
  practica: Practica;
  etapa: (typeof ETAPAS)[number];
  vuelta: number;
  onCerrar: () => void;
  onTerminar: (textos: { pregunta: string | null; texto: string }[]) => void | Promise<void>;
}) {
  const [fase, setFase] = useState<'antes' | 'practica' | 'despues'>('antes');
  const [escritura, setEscritura] = useState('');
  const [diario, setDiario] = useState('');
  const [guardando, setGuardando] = useState(false);
  const reduce = useReducedMotion();
  const oscuro = fase === 'practica';
  const FASES = ['antes', 'practica', 'despues'] as const;
  const preguntasDespues = vuelta > 1 ? [...practica.despues, '¿Qué es distinto esta vez, comparado con la vuelta anterior?'] : practica.despues;

  const terminar = async () => {
    setGuardando(true);
    const textos: { pregunta: string | null; texto: string }[] = [];
    if (escritura.trim()) textos.push({ pregunta: practica.escribir?.join(' · ') ?? practica.titulo, texto: escritura });
    if (diario.trim()) textos.push({ pregunta: practica.diarioInicio, texto: diario });
    await onTerminar(textos);
    setGuardando(false);
  };

  const claseTextarea =
    'w-full resize-none rounded-[var(--radius-card)] border p-4 text-[16px] leading-relaxed outline-none [font-family:var(--font-body)]';

  return (
    <div
      className="relative flex min-h-dvh flex-col [font-family:var(--font-body)]"
      style={
        oscuro
          ? { background: 'var(--gradient-amanecer)', color: 'var(--surface)' }
          : { background: 'var(--bg)', color: 'var(--text-primary)' }
      }
    >
      <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col px-6 pt-6 pb-10">
        <div className="flex h-14 items-center justify-between">
          <span className="text-[13px] font-medium uppercase tracking-[0.16em]" style={{ opacity: 0.75 }}>
            {etapa.nombre}{vuelta > 1 ? ` · vuelta ${vuelta}` : ''}
          </span>
          <button type="button" onClick={onCerrar} aria-label="Cerrar práctica" className="-mr-2 flex size-11 items-center justify-center">
            <X size={20} strokeWidth={2.2} color={oscuro ? 'var(--surface)' : 'var(--text-secondary)'} />
          </button>
        </div>

        <div className="flex items-center gap-2" aria-hidden="true">
          {FASES.map((f) => (
            <span
              key={f}
              className="h-1 flex-1 rounded-full"
              style={{
                background:
                  FASES.indexOf(f) <= FASES.indexOf(fase)
                    ? oscuro
                      ? 'var(--surface)'
                      : 'var(--accent)'
                    : oscuro
                      ? 'color-mix(in oklab, var(--surface) 25%, transparent)'
                      : 'color-mix(in oklab, var(--text-tertiary) 25%, transparent)',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={fase}
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="flex flex-1 flex-col"
          >
            {fase === 'antes' && (
              <>
                <div className="mt-8 flex flex-col gap-4">
                  <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                    Antes de empezar · {ETIQUETA_TIPO[practica.tipo]} · {practica.duracion}
                  </span>
                  <h1 className="text-[30px] leading-[1.1] [font-family:var(--font-display)]">{practica.titulo}</h1>
                  {practica.antes.map((t) => (
                    <p key={t} className="text-[16px] leading-relaxed text-[var(--text-secondary)]">
                      {t}
                    </p>
                  ))}
                </div>
                <p className="mt-6 text-[12px] leading-snug text-[var(--text-tertiary)]">{NOTA_NO_TERAPIA}</p>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => setFase('practica')}
                  className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-pill)] bg-[var(--text-primary)] text-[16px] font-semibold text-[var(--surface)] [touch-action:manipulation]"
                >
                  Estoy lista
                </button>
              </>
            )}

            {fase === 'practica' && (
              <>
                <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-8 text-center">
                  {practica.tipo !== 'escritura' && (
                    <motion.div
                      aria-hidden="true"
                      animate={reduce ? {} : { scale: [1, 1.08, 1] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex size-28 items-center justify-center rounded-full"
                      style={{
                        background:
                          'radial-gradient(circle, color-mix(in oklab, var(--accent-2) 55%, transparent) 0%, color-mix(in oklab, var(--accent-3) 35%, transparent) 55%, transparent 78%)',
                      }}
                    >
                      <VinculoSimbolo size={36} color="var(--surface)" />
                    </motion.div>
                  )}
                  <h1 className="text-[26px] leading-[1.15] [font-family:var(--font-display)]">{practica.titulo}</h1>

                  {practica.tipo === 'audio' && <ReproductorAudio clave={practica.audios[0].clave} etiqueta={practica.audios[0].etiqueta} />}

                  {practica.tipo === 'accion' && (
                    <div className="flex w-full flex-col items-center gap-8">
                      <ReproductorAudio clave={practica.audios[0].clave} etiqueta="1 · Apertura" />
                      {practica.temporizadorMin && <TemporizadorPractica minutos={practica.temporizadorMin} />}
                      <ReproductorAudio clave={practica.audios[1].clave} etiqueta="3 · Cierre" />
                    </div>
                  )}

                  {practica.tipo === 'escritura' && (
                    <div className="flex w-full flex-col gap-4 text-left">
                      <ul className="flex flex-col gap-2">
                        {practica.escribir?.map((q, i) => (
                          <li key={q} className="text-[15px] leading-snug" style={{ opacity: 0.92 }}>
                            {i + 1}. {q}
                          </li>
                        ))}
                      </ul>
                      <textarea
                        value={escritura}
                        onChange={(e) => setEscritura(e.target.value.slice(0, 5000))}
                        rows={7}
                        aria-label="Escribe tus respuestas"
                        placeholder="Escribe lo primero que llegue, sin pensarlo demasiado…"
                        className={claseTextarea}
                        style={{
                          background: 'color-mix(in oklab, var(--surface) 12%, transparent)',
                          borderColor: 'color-mix(in oklab, var(--surface) 30%, transparent)',
                          color: 'var(--surface)',
                        }}
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setFase('despues')}
                  className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-pill)] text-[16px] font-semibold [touch-action:manipulation]"
                  style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
                >
                  Ya terminé, seguir
                </button>
              </>
            )}

            {fase === 'despues' && (
              <>
                <div className="mt-8 flex flex-col gap-4">
                  <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                    Para mirar hacia adentro
                  </span>
                  <h1 className="text-[28px] leading-[1.1] [font-family:var(--font-display)]">¿Qué te dejó esta práctica?</h1>
                  <ul className="flex flex-col gap-3">
                    {preguntasDespues.map((q) => (
                      <li key={q} className="text-[16px] italic leading-snug text-[var(--text-secondary)] [font-family:var(--font-display)]">
                        {q}
                      </li>
                    ))}
                  </ul>
                  <label className="mt-2 flex flex-col gap-2">
                    <span className="text-[13px] font-medium text-[var(--text-secondary)]">Tu Diario — solo tú lo ves</span>
                    <textarea
                      value={diario}
                      onChange={(e) => setDiario(e.target.value.slice(0, 5000))}
                      rows={6}
                      placeholder={practica.diarioInicio}
                      className={claseTextarea}
                      style={{
                        background: 'var(--surface)',
                        borderColor: 'color-mix(in oklab, var(--text-tertiary) 30%, transparent)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </label>
                  {practica.notaSeguridad && (
                    <p className="text-[13px] leading-snug text-[var(--text-secondary)]">{practica.notaSeguridad}</p>
                  )}
                </div>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={terminar}
                  disabled={guardando}
                  className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[var(--radius-pill)] bg-[var(--text-primary)] text-[16px] font-semibold text-[var(--surface)] [touch-action:manipulation] disabled:opacity-60"
                >
                  {guardando ? 'Guardando…' : diario.trim() || escritura.trim() ? 'Guardar en mi Diario y terminar' : 'Terminar'}
                </button>
                <p className="mt-3 text-center text-[13px] text-[var(--text-tertiary)]">Puedes escribir lo que quieras, o dejarlo en blanco. Nada se pierde.</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
