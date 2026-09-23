'use client';

// ONBOARDING — Vínculo. Sigue 02B-ONBOARDING-Y-PAYWALL.md (estrategia) +
// 50-DISENO-ONBOARDING-PAYWALL.md (spec visual A-B). Nicho bienestar/consumo
// personalizado → 4-8 pasos de alto rendimiento (02B). Preguntas trazadas a
// FICHA-AVATAR.md: dolor #1 (Q1), objeción dominante (Q2), deseo #1 (Q3),
// ancla contextual (Q4), compromiso (Q5), atribución (Q6).
//
// Modelo 2 anónimo (ESTADO.md): sin registro aquí — las respuestas viven en
// localStorage (components/funnel/storage.ts) hasta el login post-paywall.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Moon, RotateCcw, Heart, Clock, Timer, Compass } from 'lucide-react';
import { Hairline } from '@/components/landing/ui';
import { FunnelHeader, BarraProgreso, ChipOpcion, PantallaPregunta, FunnelCta, FondoFunnel, conAcento } from '@/components/funnel/ui';
import { guardarRespuestas, type RespuestasOnboarding } from '@/components/funnel/storage';

type Paso =
  | 'q1' | 'q2' | 'recon1' | 'q3' | 'q4' | 'q5' | 'q6' | 'recon2' | 'loading';

const ORDEN: Paso[] = ['q1', 'q2', 'recon1', 'q3', 'q4', 'q5', 'q6', 'recon2', 'loading'];
// Endowed progress (A2 de 50): arranca en 6%, nunca en 0.
const PCT_POR_PASO: Record<Paso, number> = {
  q1: 6, q2: 22, recon1: 34, q3: 46, q4: 58, q5: 70, q6: 82, recon2: 92, loading: 100,
};

export default function Onboarding() {
  const router = useRouter();
  const [pasoIdx, setPasoIdx] = useState(0);
  const [respuestas, setRespuestas] = useState<RespuestasOnboarding>({});
  const [minutos, setMinutos] = useState(10);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const paso = ORDEN[pasoIdx];

  const avanzar = (patch?: Partial<RespuestasOnboarding>) => {
    const nuevas = patch ? { ...respuestas, ...patch } : respuestas;
    if (patch) setRespuestas(nuevas);
    if (paso === 'q6') {
      setErrorGuardado(!guardarRespuestas(nuevas));
    }
    if (pasoIdx < ORDEN.length - 1) {
      setPasoIdx(pasoIdx + 1);
    }
  };
  const atras = () => {
    setSeleccion(null);
    pasoIdx > 0 && setPasoIdx(pasoIdx - 1);
  };
  /** El chip pasa a estado seleccionado INMEDIATAMENTE y se ve 300ms antes de avanzar (A3 de 50). */
  const elegir = (op: string, campo: keyof RespuestasOnboarding) => {
    setSeleccion(op);
    setTimeout(() => {
      avanzar({ [campo]: op } as Partial<RespuestasOnboarding>);
      setSeleccion(null);
    }, 300);
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)] [font-family:var(--font-body)]">
      <FondoFunnel />
      <div className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-4">
        <FunnelHeader
          onCerrar={() => {
            if (window.confirm('¿Seguro que quieres salir? Vas a perder tus respuestas de hoy.')) {
              router.push('/');
            }
          }}
        />
        {paso !== 'loading' && (
          <BarraProgreso pct={PCT_POR_PASO[paso]} onAtras={pasoIdx > 0 ? atras : undefined} />
        )}

        <AnimatePresence mode="wait">
          {paso === 'q1' && (
            <PantallaPregunta key="q1" pregunta="¿Cuándo sientes ese vacío con más fuerza?" acento="vacío" icono={Moon}>
              {['Un domingo por la tarde', 'En una fiesta, rodeada de gente', 'De noche, antes de dormir', 'Otro momento'].map((op, i) => (
                <ChipOpcion key={op} index={i} label={op} seleccionado={seleccion === op} onClick={() => elegir(op, 'momentoVacio')} />
              ))}
            </PantallaPregunta>
          )}

          {paso === 'q2' && (
            <PantallaPregunta key="q2" pregunta="¿Ya intentaste algo para esto?" acento="intentaste" microCopy="Sin juicios — nos ayuda a no repetir lo que ya no funcionó." icono={RotateCcw}>
              {['Apps para hacer amigas', 'Un chatbot de compañía', 'Grupos o encuentros presenciales', 'Nada todavía'].map((op, i) => (
                <ChipOpcion key={op} index={i} label={op} seleccionado={seleccion === op} onClick={() => elegir(op, 'yaIntento')} />
              ))}
            </PantallaPregunta>
          )}

          {paso === 'recon1' && (
            <PantallaReconocimiento
              key="recon1"
              titulo="Ya lo intentaste, y no es que te falte algo"
              acento="no es que te falte algo"
              texto="Las apps de match te dejan justo después de conectar — la conversación se apaga sola, no por ti. Tu Mapa de Desconexión empieza un paso antes: por entender de dónde viene tu patrón."
              onContinuar={() => avanzar()}
            />
          )}

          {paso === 'q3' && (
            <PantallaPregunta key="q3" pregunta="¿Qué es lo que más extrañas?" acento="extrañas" icono={Heart}>
              {['Alguien a quien llamar sin pensarlo', 'Un grupo que también me busque a mí', 'Sentirme yo misma otra vez', 'Estar en paz cuando estoy sola'].map((op, i) => (
                <ChipOpcion key={op} index={i} label={op} seleccionado={seleccion === op} onClick={() => elegir(op, 'deseo')} />
              ))}
            </PantallaPregunta>
          )}

          {paso === 'q4' && (
            <PantallaPregunta key="q4" pregunta="¿En qué momento del día quieres tu paso diario?" acento="paso diario" microCopy="Así te avisamos a la hora en la que de verdad vas a leerlo." icono={Clock}>
              {['Al despertar', 'Al mediodía', 'En la noche'].map((op, i) => (
                <ChipOpcion key={op} index={i} label={op} seleccionado={seleccion === op} onClick={() => elegir(op, 'momentoDelDia')} />
              ))}
            </PantallaPregunta>
          )}

          {paso === 'q5' && (
            <PantallaSlider key="q5" minutos={minutos} setMinutos={setMinutos} onFijar={() => avanzar({ minutosDia: minutos })} />
          )}

          {paso === 'q6' && (
            <PantallaPregunta key="q6" pregunta="¿Cómo llegaste a Vínculo?" acento="Vínculo" icono={Compass}>
              {['Instagram o TikTok', 'Una recomendación', 'Mujer Divina', 'Otro'].map((op, i) => (
                <ChipOpcion key={op} index={i} label={op} seleccionado={seleccion === op} onClick={() => elegir(op, 'comoLlego')} />
              ))}
            </PantallaPregunta>
          )}

          {paso === 'recon2' && (
            <PantallaReconocimiento
              key="recon2"
              titulo="Tus respuestas te describen"
              acento="te describen"
              texto="Eres alguien que prefiere entender antes de actuar — no todas se detienen a mirar su propio patrón antes de salir a buscar gente nueva. Tu Mapa parte exactamente de esa fortaleza."
              onContinuar={() => avanzar()}
            />
          )}

          {paso === 'loading' && (
            <PantallaLoading
              key="loading"
              respuestas={respuestas}
              minutos={minutos}
              errorGuardado={errorGuardado}
              onListo={() => router.push('/paywall')}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PantallaReconocimiento({
  titulo,
  acento,
  texto,
  onContinuar,
}: {
  titulo: string;
  acento: string;
  texto: string;
  onContinuar: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col items-center justify-start gap-5 pt-10 text-center"
    >
      <Hairline emphasis className="rounded-full">
        <span className="flex size-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22c4-3 7-6.5 7-11a7 7 0 0 0-14 0c0 4.5 3 8 7 11Z" />
            <circle cx="12" cy="11" r="2.5" />
          </svg>
        </span>
      </Hairline>
      <h1 className="text-balance text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        {conAcento(titulo, acento)}
      </h1>
      <p className="max-w-[38ch] text-[15px] leading-relaxed text-[var(--text-secondary)]">{texto}</p>
      <div className="mt-4 w-full">
        <FunnelCta onClick={onContinuar}>Continuar</FunnelCta>
      </div>
    </motion.div>
  );
}

function PantallaSlider({
  minutos,
  setMinutos,
  onFijar,
}: {
  minutos: number;
  setMinutos: (n: number) => void;
  onFijar: () => void;
}) {
  const feedback =
    minutos <= 7 ? 'Para empezar suave' : minutos <= 15 ? 'Un ritmo sostenible' : 'Vas con todo desde el día 1';
  return (
    <PantallaPregunta pregunta="¿Cuántos minutos puedes dedicarte al día?" acento="minutos" icono={Timer}>
      <div className="flex flex-col items-center gap-1 py-2">
        <span className="text-[44px] font-bold tabular-nums leading-none text-[var(--text-primary)] [font-family:var(--font-display)]">
          {minutos}
        </span>
        <span className="text-[14px] text-[var(--text-secondary)]">minutos/día</span>
      </div>
      <input
        type="range"
        min={5}
        max={20}
        step={1}
        value={minutos}
        onChange={(e) => setMinutos(Number(e.target.value))}
        className="mt-2 h-2 w-full appearance-none rounded-full bg-[var(--surface-2)] accent-[var(--accent)]"
        aria-label="Minutos por día"
      />
      <div className="flex justify-between text-[12px] text-[var(--text-secondary)]">
        <span>5</span>
        <span>20</span>
      </div>
      <p className="mt-2 text-[14px] font-medium text-[var(--accent)]">✦ {feedback}</p>
      <div className="mt-4">
        <FunnelCta onClick={onFijar}>Fijar mi ritmo</FunnelCta>
      </div>
    </PantallaPregunta>
  );
}

function PantallaLoading({
  respuestas,
  minutos,
  errorGuardado,
  onListo,
}: {
  respuestas: RespuestasOnboarding;
  minutos: number;
  errorGuardado?: boolean;
  onListo: () => void;
}) {
  const lineas = [
    `Analizando tu momento: ${respuestas.momentoVacio ?? 'tu respuesta'}`,
    `Confirmando tu deseo: ${respuestas.deseo ?? 'tu respuesta'}`,
    `Calculando tu paso diario de ${minutos} minutos`,
    'Preparando tu Mapa de Desconexión',
  ];
  const [activa, setActiva] = useState(0);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i >= lineas.length) {
        clearInterval(id);
        setTimeout(onListo, 700);
      } else {
        setActiva(i);
      }
    }, 900);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.min(100, Math.round(((activa + 1) / lineas.length) * 100));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-start gap-8 pt-10 pb-10"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex size-28 items-center justify-center">
        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
          <circle cx="56" cy="56" r="48" fill="none" stroke="color-mix(in oklab, var(--accent) 14%, transparent)" strokeWidth="9" />
          <motion.circle
            cx="56" cy="56" r="48" fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round"
            strokeDasharray={301.6}
            initial={{ strokeDashoffset: 301.6 }}
            animate={{ strokeDashoffset: 301.6 - (301.6 * pct) / 100 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span className="absolute text-[22px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
          {pct}%
        </span>
      </div>
      <h2 className="text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Construyendo tu Mapa…
      </h2>
      <ul className="flex w-full flex-col gap-3">
        {lineas.map((l, i) => (
          <li key={l} className={`flex items-center gap-3 text-[15px] ${i <= activa ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-40'}`}>
            {i < activa ? (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]">
                <Check size={12} strokeWidth={3} color="var(--bg)" />
              </span>
            ) : i === activa ? (
              <motion.span
                className="size-5 shrink-0 rounded-full bg-[var(--accent)]"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            ) : (
              <span className="size-5 shrink-0 rounded-full border-2 border-[var(--surface-2)]" />
            )}
            {l}
          </li>
        ))}
      </ul>
      {errorGuardado && (
        <p className="text-center text-[13px] text-[var(--color-error)]">
          No pudimos guardar tus respuestas en este dispositivo — igual puedes seguir, solo tendrás que responder de nuevo si cierras la app.
        </p>
      )}
    </motion.div>
  );
}
