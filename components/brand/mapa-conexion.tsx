'use client';

// El diagrama radial del Mapa de conexión — compartido entre /onboarding (resultado
// del test) y /app (pestaña Mapa), para no duplicar el SVG y sus 3 estados de nodo
// (FICHA-ARTE v2 → dispositivo ownable "dos círculos").

import type { Categoria, EstadoNodo, ResultadoCategoria } from '@/lib/test-vinculo';
import { CATEGORIAS } from '@/lib/test-vinculo';

const ESTILO_NODO: Record<EstadoNodo, { fill: string; stroke: string; strokeDasharray?: string; textColor: string }> = {
  fuerte: { fill: 'var(--accent)', stroke: 'var(--accent)', textColor: 'var(--surface)' },
  'en-construccion': { fill: 'rgba(255,255,255,0.6)', stroke: 'var(--text-primary)', textColor: 'var(--text-primary)' },
  'por-despertar': {
    fill: 'color-mix(in oklab, var(--accent-3) 35%, transparent)',
    stroke: 'var(--accent-cielo)',
    strokeDasharray: '3 4',
    textColor: 'var(--text-primary)',
  },
};

const ETIQUETA_ESTADO: Record<EstadoNodo, string> = {
  fuerte: 'Fuerte',
  'en-construccion': 'En construcción',
  'por-despertar': 'Por despertar',
};

const POSICIONES: Record<Categoria, { x: number; y: number }> = {
  contigo: { x: 171, y: 40 },
  familia: { x: 276, y: 116 },
  amistad: { x: 236, y: 239 },
  comunidad: { x: 106, y: 239 },
  proposito: { x: 66, y: 116 },
};

const CENTRO = { x: 171, y: 150 };

export function MapaConexion({ resultado }: { resultado: ResultadoCategoria[] }) {
  return (
    <div className="relative h-[300px] w-full shrink-0">
      <svg width="100%" height="300" viewBox="0 0 342 300" aria-hidden="true">
        <g stroke="var(--text-primary)" strokeWidth="1" strokeDasharray="3 5" strokeOpacity="0.55">
          {(Object.keys(POSICIONES) as Categoria[]).map((cat) => {
            const p = POSICIONES[cat];
            return <line key={cat} x1={CENTRO.x} y1={CENTRO.y} x2={p.x} y2={p.y} />;
          })}
        </g>
        <circle cx={CENTRO.x} cy={CENTRO.y} r="26" fill="var(--accent-2)" />
      </svg>
      <div
        className="absolute flex w-10 items-center justify-center text-[14px] font-semibold text-[var(--text-primary)]"
        style={{ left: CENTRO.x - 20, top: CENTRO.y - 10 }}
      >
        Tú
      </div>
      {(Object.keys(POSICIONES) as Categoria[]).map((cat) => {
        const p = POSICIONES[cat];
        const r = resultado.find((x) => x.categoria === cat);
        const estilo = ESTILO_NODO[r?.estado ?? 'en-construccion'];
        return (
          <div
            key={cat}
            className="absolute flex size-[68px] items-center justify-center rounded-full text-center text-[11px] font-medium"
            style={{
              left: p.x - 34,
              top: p.y - 34,
              background: estilo.fill,
              border: `1.5px ${estilo.strokeDasharray ? 'dashed' : 'solid'} ${estilo.stroke}`,
              color: estilo.textColor,
            }}
          >
            {CATEGORIAS[cat].nombre}
          </div>
        );
      })}
    </div>
  );
}

export function LeyendaMapa() {
  return (
    <div className="flex items-center justify-between gap-2 text-[12px] text-[var(--text-secondary)]">
      {(Object.keys(ETIQUETA_ESTADO) as EstadoNodo[]).map((estado) => (
        <span key={estado} className="flex items-center gap-1.5">
          <span
            className="size-3 rounded-full"
            style={{
              background: ESTILO_NODO[estado].fill,
              border: `1.5px ${ESTILO_NODO[estado].strokeDasharray ? 'dashed' : 'solid'} ${ESTILO_NODO[estado].stroke}`,
            }}
          />
          {ETIQUETA_ESTADO[estado]}
        </span>
      ))}
    </div>
  );
}
