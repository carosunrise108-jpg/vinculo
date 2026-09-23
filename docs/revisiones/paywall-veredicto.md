# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-22 00:00
Screenshot: docs/revisiones/paywall-v4.png
Usabilidad: 29/40
Craft: 14/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Entre headline y plan cards] Falta la línea de pérdida del dolor #1 que FICHA-AVATAR.md exige explícitamente para esta pantalla ("DOLOR #1: agitación de la página de ventas + pérdida de la pantalla de planes") — el código solo muestra el deseo, cero agitación → agregar 1 línea corta de pérdida ("Sin tu Mapa, sigues en el mismo círculo: matches que mueren a los 3 mensajes, domingos sin nadie a quien llamar") antes de las tarjetas de precio.
2. [Fondo, franja central: timeline/CTA/trust row] El mesh de FondoFunnel (3 blobs de radio 460-520px anclados en las esquinas) deja toda la mitad inferior de la pantalla sobre el color plano var(--bg) — sigue leyéndose "casi plano" pasado el hero, mismo problema que arrastran las 3 rondas anteriores → sumar un blob centrado o extender el radio para que el tinte llegue visiblemente hasta el timeline.
3. [Tarjetas de plan — PlanCard, page.tsx líneas 179-196] El <button> interno no tiene whileTap ni ninguna animación de tap (solo transition-colors), rompe la baseline de movimiento #4 y es inconsistente con ChipOpcion del onboarding que sí anima el tap → envolver en motion.button con whileTap={{scale:0.97}}.
4. ["Restaurar compra" — page.tsx líneas 126-140] El mensaje de error filtra lenguaje interno de implementación ("cuando conectes tu cuenta de Hotmart la verás aquí") en vez de hablarle al usuario en su propio idioma → reformular sin mencionar la integración técnica, ej. "Aún no encontramos ninguna compra con este correo. Escríbenos si crees que es un error."
5. [Toda la pantalla] Cero atajos/defaults más allá del plan anual preseleccionado — heurística de flexibilidad queda en el piso típico, sin impacto visible para el usuario pero mide bajo en la rúbrica.
