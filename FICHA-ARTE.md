# FICHA DE DIRECCIÓN DE ARTE — Vínculo

- Estado: **APROBADA — v2 (2026-09-29)**. La usuaria trajo un paquete de diseño propio completo (`vinculo-para-claude-code.zip`: 6 pantallas + logo + specs de color/tipografía) y pidió reemplazar toda la identidad visual v1. Es un REBRAND, no un ajuste — v2 sustituye a v1 por completo (el historial de v1 queda más abajo, archivado, no vigente). Cosa juzgada desde aquí: no se rediscute pantalla a pantalla.

## Brand kit v2 — vigente (fuente: paquete de diseño de la usuaria, LEEME.md + 6 mockups .dc.html)
- Modo: CLARO cálido en la mayoría de pantallas (degradados Bruma→Lila→Cielo), OSCURO en Bienvenida y Práctica (degradado "Amanecer", derivado: son las 2 pantallas de mayor introspección/calma nocturna del recorrido).
- Fondo: #F7F2EA (Bruma) · Superficie: #FBF8F3 · Superficie elevada/hundida: #EDE6D8
- Texto 1º (Tinta): #1A1B2E · Texto 2º: #3A3948 · Texto 3º: #4A4858
- Acento (Noche, dato/énfasis — NUNCA fondo de botón primario): #1F2F7A
- Paleta secundaria: Alba #F4B9B2 (calidez, "tu centro") · Lila #C9B4E8 (introspección) · Cielo #6F8FC4 (calma, bordes punteados) · Luz #E6E39A (claridad, avance)
- **El botón/CTA primario usa `--text-primary` (Tinta, casi-negro) como fondo**, texto en `--bg` — píldora de 999px. Esto es distinto de v1 (donde el CTA usaba el acento): en v2 el acento es solo para datos/énfasis, no para la acción principal — así lo definen las 6 pantallas del paquete, sin excepción.
- Semánticos: éxito #4A8F6E · error #C9564F · aviso #C99A4B — ajustados a la temperatura cálida de la paleta v2 (los de v1 eran fríos, desentonaban)
- Display: **Instrument Serif** (400, itálica = "voz íntima", se usa en frases clave nunca en párrafos largos) · Body: **Hanken Grotesk** (300/400/500/600) · Etiquetas en mayúsculas con 0.16-0.18em de tracking
- Radios: tarjetas 22-26px (token 24px) · chips/opciones 18px · **CTA y navegación en píldora (999px)** — dos radios de botón conviven a propósito (chip ≠ CTA)
- Profundidad: sombras suaves tintadas de Noche (`rgb(31 47 122 / 0.1)`) + degradados con grano (ruido fractal, soft-light) en las pantallas oscuras
- Dispositivo ownable: **símbolo de dos círculos** — uno sólido (tú) + uno punteado (el otro), superpuestos. Es el logo Y el motivo decorativo (líneas punteadas para "caminos y vínculos" en Camino/Mapa). Componente: `components/brand/simbolo.tsx`. Círculo sólido relleno = vínculo "Fuerte"; círculo con borde sólido = "En construcción"; círculo punteado = "Por despertar".
- Espaciado base: escala 4·8·12·16·24·32·48·64 (no cambia)
- Motion signature: respiración/pulso lento en la pantalla de Práctica (keyframe `breathe`, 8s), transiciones estándar 200-320ms en el resto — cálido y sereno, nunca brusco

## Producto y voz (cambia con el rebrand — no solo el estilo)
- Nueva descripción: "App de meditación y prácticas guiadas para transformar la soledad en conexión."
- Tagline: **"Primero tú. Luego, nosotros."**
- Voz: serena (no eufórica), cercana (no invasiva), honesta (no clínica) — mismo espíritu que v1, tono más contemplativo.
- Flujo: Bienvenida → Test inicial (12 preguntas) → Mapa de conexión (resultado, 5 nodos) → Hoy → Camino → Práctica. Navegación inferior: **Hoy · Camino · Mapa · Diario** (reemplaza Hoy/Tu Mapa/Perfil de v1 — Perfil se retira de la nav, Diario es nuevo).
- Las 5 etapas de la Ruta cambian de nombre (siguen siendo 5, se ganan por avance real, no por calendario — la regla de fondo no cambia): **Quietud → Presencia → Raíz → Apertura → Vínculo**.
- El "Mapa" ahora es una foto de 5 categorías de vínculo (Contigo, Familia, Amistad, Comunidad, Propósito), no las 6 dimensiones psicológicas que la usuaria había propuesto por escrito antes (decisión tomada 2026-09-29: se usa el test ya diseñado en el paquete, más corto y con las pantallas ya listas).
- Nuevo: "Plan de regreso" — si la persona se aísla/retrocede, la app le propone un plan de 3 días para volver, sin culpa (mismo principio que v1: nunca castigar el retroceso).
- Seguridad: si el Mapa muestra señales fuertes de soledad, mostrar con delicadeza recursos de ayuda profesional reales (ver `lib/ayuda-profesional.ts`, verificados por país 2026-09-29) — nunca como diagnóstico.

## Trazabilidad v2
- Fuente: `vinculo-para-claude-code.zip` (Descargas de la usuaria, 2026-09-29) — 6 pantallas (`Bienvenida`, `Test`, `Mapa`, `Hoy`, `Camino`, `Práctica`), `LEEME.md`, logo (SVG+PNG claro/oscuro, ícono de app).
- Assets copiados a `public/logo/` y `app/icon.png`; símbolo como componente en `components/brand/simbolo.tsx`.
- Plan de ejecución por capas (ESTADO.md): 1) identidad base ✅ 2) landing 3) test+mapa 4) paywall 5) login 6) app interna 7) actualizar Hotmart.
- Pendiente de la usuaria: grabaciones de audio reales para Práctica (confirmó que puede hacerlas, no existen todavía — la pantalla se construye completa, sin audio real por ahora).

---

## Archivo — v1 (2026-09-22, YA NO VIGENTE, reemplazada por el rebrand de arriba)

<details>
<summary>Historial v1 (violeta claro / Fredoka+Nunito) — solo para trazabilidad, no usar como referencia de código</summary>

### Historial de la decisión v1
- Ronda 1 (2026-09-09/11) — referencia de la usuaria: paleta jardín nocturno oscuro (violeta/azul/verde-azulado, Fraunces+Karla). 3 interpretaciones en `docs/revisiones/direcciones-abc-full.png`. **DESCARTADA por la usuaria** (2026-09-22: "muy aburrido y plano"); pidió alegre/juvenil/versátil con íconos.
- Ronda 2 (2026-09-22) — SIN referencia nueva (ruta 1: propuesta propia), fusión de líderes Finch + Duolingo + Fabulous, modo claro. 3 opciones nuevas en `docs/revisiones/direcciones-abc-v2-full.png`: A "Chispa" (coral/amarillo), B "Complicidad" (violeta/rosa), C "Movimiento" (violeta/lima, descartada).
- La usuaria probó B, pidió más violeta, y luego combinó: composición de A + tonalidades violeta/rosa de B.
- Tour de la app (4 vistas) construido y aprobado: `vista-previa-app.html`.

### Brand kit v1 (reemplazado — NO usar)
- Fondo: #F6F2FF · Superficie: #FFFFFF · Superficie elevada/hundida: #E7DDFF
- Texto 1º: #241B36 · Texto 2º: #8478A0
- Acento: #8B6FEC (botón CTA usaba el acento directamente, distinto de v2)
- 2ª nota: #FF93B0
- Display: Fredoka (500/600/700) · Body: Nunito (400/600/700/800)
- Radio: 24px cards · 18px botones (sin píldora)
- Dispositivo ownable v1: tarjetas-pegatina (rotación ligera alternada) — SE MANTIENE como técnica pero ya no es el dispositivo principal (el símbolo de dos círculos lo reemplaza en v2)
- Registro anti-repetición v1: paleta violeta claro + rosa secundario + par Fredoka/Nunito quedaron vetados para el próximo proyecto del SO (esto sigue vigente para OTROS proyectos, aunque Vínculo ya no los use)

</details>

## Idioma UI: español LATAM neutro · Fecha de cierre de la ficha v2: 2026-09-29 · Aprobada por la usuaria: SÍ
