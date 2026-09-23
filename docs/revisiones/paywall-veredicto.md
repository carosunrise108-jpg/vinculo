# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-22 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 34/40
Craft: 11/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Toda la pantalla — plan cards y timeline] El dispositivo ownable definido en FICHA-ARTE.md ("tarjetas-pegatina": rotación ligera alternada -1.2°/+1° en cards secundarias) sigue sin implementarse en page.tsx — cero `rotate`/`transform` en `PlanCard` ni en el bloque del timeline; en el screenshot ambas cards y el timeline son rectángulos perfectamente alineados, indistinguibles de cualquier paywall violeta genérico → aplicar la rotación alternada como firma visual antes de declarar identidad cumplida.
2. [Fondo de toda la pantalla] `FondoFunnel` (mesh gradient radial al 10%/8% de opacidad, posicionado en -8% del viewport) es imperceptible en el screenshot — el fondo se ve como fill plano #F6F2FF pese a existir en código; solo hay 2 niveles de superficie visibles (bg/surface), sin nivel hundido real → subir la opacidad del mesh a 15-20% y reubicarlo dentro del área visible, o agregar un elemento con superficie hundida (ej. inset en el timeline).
3. [Código — todas las animaciones] Ninguna animación (`staggerChildren`, `scaleY` del timeline, `whileTap`) está envuelta con `useReducedMotion()` de motion/react ni con un chequeo de `prefers-reduced-motion` — viola la regla UX #10/DESIGN-CORE de respetar movimiento reducido siempre → condicionar duración/transiciones a la preferencia del sistema.
4. [Headline vs precio vs cuerpo] La pantalla usa 4 tamaños de texto visibles a la vez (headline 28px, precio 22px, cuerpo 14-16px, label 12.5-13px) cuando el máximo recomendado por la jerarquía de 4 niveles es 3 tamaños simultáneos → fusionar precio y algún nivel de cuerpo al mismo tamaño para volver a 3.
5. [Bajo "Restaurar compra"] El mensaje condicional de restaurar compra (línea 124-128) aparece/desaparece de forma abrupta sin `motion.div`/fade, rompiendo la consistencia de movimiento del resto de bloques (todos animados con `variants`) → envolverlo en `motion.div` con fade-in de ~200ms igual que las demás secciones.

Progreso vs. la ronda anterior: los 5 defectos previos (value-stack duplicado + CTA fuera de viewport, total anual a 12px, línea de reversibilidad duplicada, headline con acento de 6 palabras) están resueltos y verificados en código y screenshot. Usabilidad subió de 31→34/40 y craft de 9→11/20, pero ambos siguen por debajo del gate (≥36/40 y ≥16/20): el problema ya no es de estructura/copy sino de EJECUCIÓN DE IDENTIDAD Y CRAFT (dispositivo ownable ausente, profundidad casi imperceptible, reduced-motion no verificado en código).
