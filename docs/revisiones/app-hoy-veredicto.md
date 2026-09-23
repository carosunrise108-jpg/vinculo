# VEREDICTO revisor-visual — app-hoy
Fecha: 2026-09-23 00:00
Screenshot: docs/revisiones/app-hoy-375.png
Usabilidad: 31/40
Craft: 14/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Nav inferior / cambio de pestaña Hoy-Mapa-Perfil] El contenido cambia instantáneo sin transición (no hay AnimatePresence entre tabs, page.tsx líneas 125-138) → envolver el render condicional en AnimatePresence mode="wait" con fade/slide 200-300ms.
2. [Mensaje de error bajo la tarjeta "Hoy", línea 304-308] El error de guardado local solo informa, no da acción de recuperación → agregar botón "Reintentar" que vuelva a llamar registrarPasoHoy.
3. [Tarjeta de check-in, 3 botones Lo hice/Lo intenté/Hoy no pude] Nada indica visualmente que la respuesta se puede cambiar después de elegida — se ve como estado final/bloqueado → agregar microcopy "Puedes cambiarla cuando quieras" cerca de las opciones.
4. [Anillo de etapa + header "Etapa 2/5"] No hay celebración implementada al completar una etapa real, pese a que FICHA-ARTE exige "celebrar solo hitos reales" (personalidad, línea 27-28) → agregar animación de hito (confetti/lottie sutil) disparada al subir etapaActual, ausente en el código actual.
5. [Pantalla completa, flujo de check-in diario] Cero atajos o memoria de uso repetido (heurística 7: sin preselección basada en el patrón reciente del usuario, sin gestos) → considerar sugerir/preseleccionar la opción más frecuente sin forzarla.
