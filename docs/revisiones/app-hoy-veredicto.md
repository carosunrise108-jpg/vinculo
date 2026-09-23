# VEREDICTO revisor-visual — app-hoy
Fecha: 2026-09-23 00:00
Screenshot: docs/revisiones/app-hoy-375.png
Usabilidad: 27/40
Craft: 15/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. components/app/storage.ts registrarPasoHoy() incrementa pasosCompletados en CADA click de "Lo hice" sin verificar el estado previo (actual.pasoHoyEstado) — re-seleccionar la misma opción o alternar entre opciones y volver a "Lo hice" infla el contador y puede disparar una celebración de etapa falsa el mismo día → fix: solo sumar si actual.pasoHoyEstado !== 'hecho' antes de la llamada.
2. app/app/page.tsx linea 321 y storage.ts: el copy "Puedes cambiarla cuando quieras" promete reversibilidad total del check-in, pero si el usuario ya subió de etapa y luego cambia su respuesta de "hecho" a otra opcion, la etapa avanzada y el conteo NO se revierten → fix: restar el paso al cambiar de "hecho" a otro estado, o ajustar el copy para aclarar que el avance de etapa ya confirmado no se deshace.
3. app/app/page.tsx lineas 253-256: pasoTitulo solo distingue "etapa <=2" vs "resto" — las etapas 3, 4 y 5 (Escucharte a ti misma / Tu ritual semanal / Abrirte a los demas) muestran el mismo texto de tarea ("date 5 minutos sin celular antes de dormir"), que no corresponde al tema de las etapas 4 y 5 → fix: un texto de tarea por etapa, no un binario.
4. app/app/page.tsx linea 446-461 (Perfil, switch de notificaciones): el boton role="switch" no tiene aria-label ni aria-labelledby apuntando al texto "Notificaciones" — un lector de pantalla anuncia "switch, no activado" sin nombre → fix: aria-label="Notificaciones" o aria-labelledby con el id del texto adyacente.
5. Heuristica 7 (flexibilidad/atajos) — reconocida por el equipo como deuda de bajo impacto sin resolver; sigue bajando el puntaje aunque la decision de no autofocus sea razonable.
