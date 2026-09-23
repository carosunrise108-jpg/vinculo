# VEREDICTO revisor-visual — paywall
Fecha: 2026-09-22 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 31/40
Craft: 9/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Estructura completa de la pantalla] Se apilan DOS visuales del valor (value stack de 3 checks + timeline C4 completo) cuando la doc (50 §C4) ordena usar el timeline como visual DEFAULT único en paywall CON trial y reservar el value stack para hard paywall SIN trial — el resultado es una pantalla ~950-1000px de alto en un viewport de 844px: el CTA queda fuera del primer viewport, violando el requisito de C1 ("deben verse promesa, plan, precio y CTA" en 390x844) → eliminar el bloque de 3 checks y dejar solo el timeline como visual del valor.
2. [Bajo cada plan card] El total anual "Se cobra US$49.99/año" está a 12px (line 173 de page.tsx: `text-[12px]`) — la doc exige mínimo 14px móvil para precio/legal crítico y lo lista explícitamente como anti-patrón en C5 ("Legal/precio crítico a 12px") → subir a `text-[14px]`.
3. [Bajo el CTA] La línea de reversibilidad "Hoy no pagas nada · Te avisamos 1 día antes del cobro · Cancela en 1 tap" duplica exactamente lo que ya muestra el timeline de 3 nodos arriba — C4bis dice explícitamente "si el timeline ya muestra los 3, no duplicar" → quitar la línea repetida bajo el CTA o acortarla a "Cancela cuando quieras" como sugiere C4.
4. [Toda la pantalla — fondo y cards] Cero rastro del dispositivo ownable de FICHA-ARTE.md ("tarjetas-pegatina" con rotación -1.2°/+1° en cards secundarias, chips con relieve soft-3D) ni de la profundidad prometida (sombras tintadas + degradé tonal + glow de esquina): fondo es un fill plano #F6F2FF, cards blancas rectas sin sombra ni rotación → aplicar la rotación alternada a las plan cards/timeline y agregar sombra tintada de violeta (--shadow-2) + glow sutil de esquina en el héroe, como define la ficha.
5. [Headline] El acento cubre ~6 palabras ("estar en paz cuando estoy sola") cuando la doc pide resaltar 1-3 palabras clave que venden (nunca la frase completa) — diluye la jerarquía de énfasis → recortar el acento a la palabra/frase núcleo del deseo (ej. solo "en paz") y dejar el resto en texto primario.
