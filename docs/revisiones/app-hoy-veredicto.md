# VEREDICTO revisor-visual — app-hoy
Fecha: 2026-09-23 00:00
Screenshot: docs/revisiones/app-hoy-375.png
Usabilidad: 30/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos: 1) prefers-reduced-motion solo cubierto en CountUp (código page.tsx) — ring/stagger/tap/transición de tabs/celebración lo ignoran → agregar useReducedMotion()/MotionConfig global. 2) Heurística 7 (flexibilidad) en 1/4, sin atajos ni defaults para usuario recurrente. 3) Celebración usa ease cúbico, no spring, contradice motion signature de FICHA-ARTE ("celebraciones spring suave"). 4) Botones de check-in inactivos con bajo contraste entre sí (border + bg=var(--bg)) — jerarquía de opciones poco clara a simple vista. 5) Banner de celebración con fondo casi negro rompe la paleta 100% clara de la pantalla, se siente ajeno al resto del sistema.
