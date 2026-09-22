# FICHA DE DIRECCIÓN DE ARTE — Vínculo

- Estado: **APROBADA** (2026-09-22 — tour de la app aprobado por la usuaria: "1. Me encanta, sigamos con este estilo"). Cosa juzgada desde aquí: no se rediscute pantalla a pantalla.

## Historial de la decisión (evidencia)
- Ronda 1 (2026-09-09/11) — referencia de la usuaria: paleta jardín nocturno oscuro (violeta/azul/verde-azulado, Fraunces+Karla). 3 interpretaciones en `docs/revisiones/direcciones-abc-full.png`. **DESCARTADA por la usuaria** (2026-09-22: "muy aburrido y plano"); pidió alegre/juvenil/versátil con íconos.
- Ronda 2 (2026-09-22) — SIN referencia nueva (ruta 1: propuesta propia), fusión de líderes Finch + Duolingo + Fabulous, modo claro. 3 opciones nuevas en `docs/revisiones/direcciones-abc-v2-full.png`: A "Chispa" (coral/amarillo), B "Complicidad" (violeta/rosa), C "Movimiento" (violeta/lima, descartada).
- La usuaria probó B, pidió más violeta (`direcciones-abc-v2-opcion-b.png`), y luego combinó: **composición de A + tonalidades violeta/rosa de B** (`direcciones-abc-v2-opcion-a-violeta.png`).
- Ajuste de copy: eliminar la palabra "rota/roto" del tono de venta — sustituir por algo sutil y aspiracional ("conócete primero, todo lo demás llega solo").
- Tour de la app (4 vistas) construido y APROBADO: `vista-previa-app.html` + `docs/revisiones/vista-previa-app-full.png`.

## Brand kit final (valores para globals.css / @theme)
- Modo: CLARO
- Fondo: #F6F2FF · Superficie: #FFFFFF · Superficie elevada/hundida: #E7DDFF
- Texto 1º: #241B36 · Texto 2º: #8478A0
- Acento (líder, violeta): #8B6FEC — texto sobre acento claro: #5B3FE0 · SOLO en CTA, dato clave, ícono activo
- 2ª nota de color (rosa, secundaria): #FF93B0 — solo en detalles puntuales (glow de esquina, borde de tarjeta destacada), nunca como color principal
- Semánticos: éxito #3FB27F (a definir con más precisión en Sesión 5) · error #E5484D · aviso #E8A73D — provisionales, ajustar si el testing lo pide
- Display: **Fredoka** (500/600/700) · Body: **Nunito** (400/600/700/800) · Escala: display 24px / title 17-21px / body 13-15px / label 10.5-12px
- Radio: 24px cards · 18px botones (orgánico, nunca anguloso)
- Profundidad: sombras suaves TINTADAS de violeta (nunca negras planas) + degradé tonal en la tarjeta héroe + glow de esquina sutil
- Dispositivo ownable: **tarjetas-pegatina** — cards secundarias con rotación ligera alternada (-1.2°/+1°), como si fueran notas pegadas; ícono en chip con relieve suave (soft-3D)
- Espaciado base: escala 4·8·12·16·24·32·48·64
- Motion signature: tap 100-150ms, transiciones 220-320ms, celebraciones spring suave — cálido y ligero, nunca brusco (11, pendiente de compilar tabla completa en Sesión 4/5)

## Personalidad (11 — provisional, compilar tabla completa cuando se diseñe el ritual diario)
- 3 adjetivos: cálida · lúdica · cercana
- Celebrar solo hitos reales (pasos dados, no rachas de calendario)

## Trazabilidad y vetos
- Ruta de diseño: Ronda 1 con referencia parcial de la usuaria (descartada) → Ronda 2 sin referencia, propuesta propia (fusión de líderes) → elegida por combinación de opciones
- Protocolo A/B/C: `direcciones-abc.html` (Ronda 2, vigente) — opciones A/B/C y la combinación final documentadas arriba; Ronda 1 archivada aparte
- Tour de la app: `vista-previa-app.html` — 4 vistas (M0, onboarding, paywall, mecanismo en acción) — aprobado 2026-09-22
- Registro anti-repetición: paleta violeta claro + rosa secundario + par Fredoka/Nunito quedan **vetados para el próximo proyecto del SO**
- Modo (claro) DERIVADO de: el brief "alegre" de la usuaria — explícitamente lo opuesto al oscuro de la Ronda 1 descartada

## Idioma UI: español LATAM neutro · Fecha de cierre de la ficha: 2026-09-22 · Aprobada por la usuaria: SÍ
