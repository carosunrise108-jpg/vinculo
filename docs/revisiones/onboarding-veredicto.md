# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-22 00:00
Screenshot: docs/revisiones/onboarding-q1-v3.png
Usabilidad: 32/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) FondoFunnel (components/funnel/ui.tsx) sigue imperceptible en pantalla real pese al aumento de opacidad — los 9 screenshots se ven planos → usar tinte de superficie más saturado/opaco o banda con --surface-2. 2) Vacío grande arriba/abajo del bloque de contenido en preguntas y reconocimientos (q1, recon1, q4, q6...) → reducir padding vertical o llenar con elemento de apoyo. 3) Indicador dev de Next.js ("N" negro inferior izq.) visible en todos los renders → capturar sobre build de producción. 4) Heurística 3: sin affordance explícita de salir/cancelar el onboarding más allá del logo poco descubrible → agregar salida visible. 5) Heurística 7: flujo 100% lineal, sin atajo para saltar/revisar una respuesta ya dada.
