'use client';

// La carta íntima del Mapa (por qué conectar + beneficios + invitación) — compartida entre
// el resultado del test (/onboarding) y la pestaña Mapa de /app.

import { Check } from 'lucide-react';
import { CARTAS, POR_QUE_CONECTAR } from '@/lib/cartas-conexion';
import type { Categoria } from '@/lib/test-vinculo';

export function CartaConexion({ categoria }: { categoria: Categoria }) {
  const carta = CARTAS[categoria];
  return (
    <article className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">
      <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
        Una carta para ti
      </span>
      <h2 className="text-[26px] italic leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]">
        {carta.titulo}
      </h2>

      <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">{carta.porQue}</p>
      <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">{POR_QUE_CONECTAR}</p>

      <div className="flex flex-col gap-3">
        <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
          Lo que puede cambiar
        </span>
        <ul className="flex flex-col gap-3">
          {carta.beneficios.map((b) => (
            <li key={b} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--text-primary)]">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]">
                <Check size={12} strokeWidth={3} color="var(--accent)" aria-hidden="true" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[19px] italic leading-snug text-[var(--text-primary)] [font-family:var(--font-display)]">
        {carta.invitacion}
      </p>
    </article>
  );
}
