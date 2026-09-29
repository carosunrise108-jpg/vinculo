'use client';

// ONBOARDING v2 — Vínculo (rebrand 2026-09-29). Sigue el paquete de diseño de la
// usuaria: App-Bienvenida → App-Test (12 preguntas, 5 categorías) → App-Mapa
// (resultado, antes del paywall — pedido explícito de la usuaria: "mostrar el
// resultado antes de cobrar"). Copy y preguntas: lib/test-vinculo.ts.
//
// Modelo 2 anónimo (ESTADO.md): sin registro aquí — las respuestas viven en
// localStorage (components/funnel/storage.ts) hasta el login post-paywall.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { VinculoSimbolo } from '@/components/brand/simbolo';
import { MapaConexion, LeyendaMapa } from '@/components/brand/mapa-conexion';
import { FunnelHeader, BarraProgreso, ChipOpcion, PantallaPregunta, FunnelCta } from '@/components/funnel/ui';
import { guardarRespuestasTest, type RespuestasTest } from '@/components/funnel/storage';
import { PREGUNTAS, CATEGORIAS, calcularResultado, categoriaMasDebil } from '@/lib/test-vinculo';

type Paso = 'bienvenida' | number | 'resultado'; // number = índice de pregunta (0-11)

export default function Onboarding() {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>('bienvenida');
  const [respuestas, setRespuestas] = useState<RespuestasTest>({});
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [errorGuardado, setErrorGuardado] = useState(false);

  const elegir = (idPregunta: string, puntaje: number) => {
    setSeleccion(puntaje);
    setTimeout(() => {
      const nuevas = { ...respuestas, [idPregunta]: puntaje };
      setRespuestas(nuevas);
      setSeleccion(null);
      if (typeof paso === 'number' && paso < PREGUNTAS.length - 1) {
        setPaso(paso + 1);
      } else {
        setErrorGuardado(!guardarRespuestasTest(nuevas));
        setPaso('resultado');
      }
    }, 300);
  };

  const atras = () => {
    setSeleccion(null);
    if (typeof paso === 'number' && paso > 0) setPaso(paso - 1);
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)] [font-family:var(--font-body)]">
      {paso !== 'bienvenida' && paso !== 'resultado' && (
        <div className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-4">
          <FunnelHeader
            onCerrar={() => {
              if (window.confirm('¿Seguro que quieres salir? Vas a perder tus respuestas de hoy.')) {
                router.push('/');
              }
            }}
          />
          <BarraProgreso
            pct={((paso + 1) / PREGUNTAS.length) * 100}
            onAtras={paso > 0 ? atras : undefined}
            label={`${paso + 1}/${PREGUNTAS.length}`}
          />
          <AnimatePresence mode="wait">
            {PREGUNTAS.map((p, i) =>
              i === paso ? (
                <PantallaPregunta
                  key={p.id}
                  pregunta={p.texto}
                  acento={p.acento}
                  kicker={`Test inicial · ${CATEGORIAS[p.categoria].nombre}`}
                  piePersonalizado="No hay respuestas correctas. Solo tu punto de partida."
                >
                  {p.opciones.map((op, oi) => (
                    <ChipOpcion
                      key={op.label}
                      index={oi}
                      label={op.label}
                      seleccionado={seleccion === op.puntaje}
                      onClick={() => elegir(p.id, op.puntaje)}
                    />
                  ))}
                </PantallaPregunta>
              ) : null
            )}
          </AnimatePresence>
        </div>
      )}

      {paso === 'bienvenida' && <PantallaBienvenida onComenzar={() => setPaso(0)} />}

      {paso === 'resultado' && (
        <PantallaResultado
          respuestas={respuestas}
          errorGuardado={errorGuardado}
          onEmpezarCamino={() => router.push('/paywall')}
        />
      )}
    </div>
  );
}

function PantallaBienvenida({ onComenzar }: { onComenzar: () => void }) {
  return (
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden px-6 pt-16 pb-10"
      style={{ background: 'var(--gradient-amanecer)', color: 'var(--surface)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[14%] size-64 -translate-x-1/2 rounded-full blur-md"
        style={{
          background:
            'radial-gradient(circle at 42% 60%, var(--accent-2) 0%, var(--accent-3) 38%, color-mix(in oklab, var(--accent-cielo) 60%, transparent) 62%, transparent 75%)',
        }}
      />
      <div className="relative z-10 flex justify-center pt-14">
        <VinculoSimbolo size={56} color="var(--surface)" />
      </div>
      <div className="relative z-10 mt-auto flex flex-col items-center gap-4 pb-10 text-center">
        <h1 className="text-[64px] leading-none [font-family:var(--font-display)]">Vínculo</h1>
        <p className="max-w-[280px] text-[17px] font-light leading-relaxed">
          Un camino para volver a ti y, desde ahí, encontrarte con los demás.
        </p>
      </div>
      <div className="relative z-10 flex flex-col gap-3.5">
        <FunnelCta onClick={onComenzar}>Comenzar mi test</FunnelCta>
        <a href="/login" className="flex h-11 items-center justify-center text-[15px] font-medium" style={{ color: 'var(--surface)' }}>
          Ya tengo cuenta
        </a>
      </div>
    </div>
  );
}

function PantallaResultado({
  respuestas,
  errorGuardado,
  onEmpezarCamino,
}: {
  respuestas: RespuestasTest;
  errorGuardado: boolean;
  onEmpezarCamino: () => void;
}) {
  const reduce = useReducedMotion();
  const resultado = calcularResultado(respuestas);
  const debil = categoriaMasDebil(resultado);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.3 }}
      className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col gap-5 px-6 pt-14 pb-10"
    >
      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
          Resultado del test
        </span>
        <h1 className="text-[38px] leading-[1.05] [font-family:var(--font-display)]">
          Tu mapa <span className="italic">de conexión</span>
        </h1>
      </div>

      <MapaConexion resultado={resultado} />
      <LeyendaMapa />

      <div className="flex flex-col gap-2 rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] p-5">
        <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
          Tu punto de partida
        </span>
        <p className="text-[22px] leading-[1.25] [font-family:var(--font-display)]">
          El vínculo con <span className="lowercase">{CATEGORIAS[debil.categoria].nombre}</span> es el que más espacio
          pide. <span className="italic">Empezaremos por ahí.</span>
        </p>
      </div>

      {errorGuardado && (
        <p className="text-center text-[13px] text-[var(--color-error)]">
          No pudimos guardar tus respuestas en este dispositivo — igual puedes seguir, solo tendrás que responder de
          nuevo si cierras la app.
        </p>
      )}

      <div className="flex-1" />
      <FunnelCta onClick={onEmpezarCamino}>Empezar mi camino</FunnelCta>
    </motion.div>
  );
}
