# VEREDICTO revisor-visual — app-hoy
Fecha: 2026-09-23 00:00
Screenshot: docs/revisiones/app-hoy-375.png
Usabilidad: 28/40
Craft: 16/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Header, fecha] "Miércoles, 23 De Septiembre" — la clase `capitalize` en page.tsx (línea ~265) se aplica sobre el string ya formateado por Intl.DateTimeFormat y capitaliza CADA palabra, incluida la preposición "de" → quitar `capitalize` y capitalizar solo la primera letra en JS.
2. [Card héroe vs bloque "Vas X pasos"] Datos semilla inconsistentes: INICIAL en storage.ts fija etapaActual:2 con pasosCompletados:1, pero la regla de negocio exige 3 pasos completados por etapa (PASOS_POR_ETAPA=3) — la pantalla muestra "Etapa 2/5" y "Vas 1 paso en tu camino" a la vez, números que no cuadran entre sí → fijar el seed a pasosCompletados:3 (o el valor real que corresponde a etapa 2).
3. [Modal de celebración de etapa] El contenedor de "Nueva etapa: …" no tiene `role="status"`/`aria-live` → un usuario de lector de pantalla no se entera del hito logrado (verificado en código, app/app/page.tsx ~línea 163) → agregar `role="status" aria-live="polite"`.
4. [Heurística 7 — flexibilidad] Pantalla más visitada de la app (ritual diario M0) sin ningún atajo o ahorro de fricción para el uso repetido (no recuerda ni sugiere la opción típica del usuario) → considerar preseleccionar o resaltar sutilmente la opción más usada históricamente.
5. [Card héroe] El número de etapa se repite dos veces en el mismo bloque visual (texto "Etapa 2/5" + anillo "2/5") sin aportar jerarquía nueva, ocupando espacio sin sumar valor → fusionar en una sola fuente de verdad visual (dejar el anillo o el texto, no ambos).
