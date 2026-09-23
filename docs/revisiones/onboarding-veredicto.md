# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-22 00:00
Screenshot: docs/revisiones/onboarding-q1-v4.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. PantallaReconocimiento (recon1/recon2) y PantallaLoading siguen en `justify-center` (app/onboarding/page.tsx líneas ~167 y ~269) — el fix de la ronda 3 solo tocó PantallaPregunta. En recon1/recon2/loading queda ~40-45% de blanco repartido arriba+abajo del contenido (ver onboarding-recon1-v4.png, onboarding-recon2-v4.png, onboarding-loading-v4.png).
2. Preguntas con 3-4 chips cortos (q1, q2, q4, q6) siguen dejando ~25-30% de aire muerto bajo el último chip pese a `justify-start pt-8` — el contenido subió pero no se llenó el alto restante (components/funnel/ui.tsx PantallaPregunta).
3. FondoFunnel: el bug de z-index está corregido y el mesh ya se ve (esquinas con lavanda/rosa/púrpura), pero el radio de caída (46%/44%/42%) deja el 55-60% central de cada pantalla prácticamente plano/blanco — sigue leyéndose como fondo casi liso en el cuerpo de la pantalla, no como profundidad distribuida.
4. X de salida (FunnelHeader onCerrar, app/onboarding/page.tsx línea 65) navega a "/" sin ninguna confirmación ni aviso — a mitad de un flujo de 9 pasos con datos ya tecleados (slider, respuestas) no hay "¿seguro que quieres salir?", rompe control y libertad a medio camino.
5. Heurística 7 (flexibilidad) sigue baja a propósito: cero atajo de teclado/selección rápida en preguntas de opción única — aceptado como decisión consciente pero sigue limitando el total.
