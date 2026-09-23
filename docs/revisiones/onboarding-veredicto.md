# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-23 00:00
Screenshot: docs/revisiones/onboarding-q1-v5.png
Usabilidad: 30/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Cuerpo de q1/q2/q3/q4/q6, entre el último chip y el footnote "Puedes cambiar tu respuesta más adelante"] Queda un vacío de ~150-200px sin contenido — el footnote con mt-auto solo reubicó el vacío al fondo, no lo llenó → centrar verticalmente el bloque de contenido en vez de anclarlo arriba, o agregar un elemento que ocupe ese espacio con intención (ilustración de apoyo, dato de contexto).
2. [recon1/recon2/loading, tercio inferior de la pantalla] Sigue habiendo 30-45% de blanco debajo del CTA/checklist pese al pt-10 — la corrección de la ronda 4 redujo el vacío pero no lo eliminó → agrandar el ícono/ilustración o sumar contenido secundario (cita, mini-dato) proporcional a la altura real de estas pantallas.
3. [Header, botón X → diálogo de salida] window.confirm() nativo del navegador rompe el sistema visual cálido/redondeado de la app (popup gris del sistema, tipografía y botones ajenos a la marca) → reemplazar por un AlertDialog propio con los tokens de FICHA-ARTE (radio, color, tipografía).
4. [Fondo, franja central de cada pantalla] El 4º blob radial centrado (surface-2 32%) sigue siendo imperceptible en el screenshot real — el propio comentario del código admite que ya fue "imperceptible" en 3 rondas previas y la opacidad actual repite el patrón → subir el contraste/opacidad del blob central o cambiar de técnica (textura sutil) hasta que se vea en captura real, no solo en teoría.
5. [Pantalla loading, número de %] El contador de porcentaje salta directo a cada valor (25/50/75/100) sin animación de conteo, y no hay celebración al llegar a 100% antes de navegar al paywall → animar el conteo dígito a dígito y agregar un pulso/celebración breve al completar antes del onListo.
