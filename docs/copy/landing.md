# Copy marcado — página de ventas de Vínculo

> Derivado de `FICHA-AVATAR.md` (57). Cada pieza cita el campo de origen. Marcadores: `[acento]…[/acento]` (color de marca), `[b]…[/b]` (semibold).
> Modelo de monetización: MODELO 2, variante anónima (02C/ESTADO.md) — el CTA lleva a `/onboarding`, nunca al checkout desde la landing.

CTA_LABEL = "Descubrir mi Mapa gratis"
CTA_HREF = "/onboarding"

## 1. HERO
- h1Marked: `Conócete primero. Todo lo demás [acento]llega solo[/acento]`
  - Fuente: ajuste de tono pedido por la usuaria (2026-09-22) — evita "rota", vende el autoconocimiento como algo atractivo, no como reparar un defecto. Acento recortado a 2 palabras (revisor-visual, corrección post-veredicto 2026-09-22).
- subtitleMarked: `Tu Mapa de Desconexión te muestra tu patrón y te da [b]un paso semanal[/b]`
  - Fuente: mecanismo bautiado (Constitución 4b) + deseo #1 de la ficha.
- ctaLabel: "Descubrir mi Mapa gratis"
- socialProof: "De la creadora de Mujer Divina" (fuente: activo real de la usuaria, FICHA-AVATAR.md §Cierre — 2026-09-29: se retiró la cifra de mujeres acompañadas a pedido de la usuaria)
- visualPlaceholderSugerencia: "captura de la pantalla principal con el Mapa de Desconexión ya generado"

## 2. PROBLEMA
- titulo: "¿Te suena?"
- preguntas (fuente: reescritas 2026-09-29 (2ª pasada) — la usuaria pidió que se relacionen
  directamente con las preguntas del test que arma el Mapa de conexión (lib/test-vinculo.ts):
  una frase por cada una de las 5 categorías, eco de su pregunta correspondiente, para que la
  landing haga message-match con el test antes de que la persona lo empiece):
  1. icon Moon — "Pasas una tarde sola y sientes que te falta algo." (categoría Contigo, eco de p1)
  2. icon Home — "Con tu familia, casi nunca hablas de lo que de verdad importa." (categoría Familia, eco de p5)
  3. icon Phone — "Nadie a quien llamar sin pensarlo dos veces." (categoría Amistad, eco de p6)
  4. icon Users — "Sientes que no perteneces a ningún grupo." (categoría Comunidad, eco de p9)
  5. icon Compass — "Lo que haces día a día ya no te hace sentido." (categoría Propósito, eco de p11)

## 3. AGITACIÓN (fuente: COSTO DE LA INACCIÓN de la ficha)
- frases:
  1. `Cada mes que sigue igual son otros [acento]4 domingos vacíos[/acento] que no vuelven.`
  2. `En un año son casi [b]50 domingos[/b] sintiendo que ya se te pasó el momento.`
  3. `Otra app de match no lo arregla: [b]más conversaciones no es más conexión[/b].`
- contraste: Hoy = "El celular lleno de contactos y nadie a quien llamar." · En 6 meses si nada cambia = "El mismo vacío — con 6 meses menos."

## 4. SOLUCIÓN (fuente: mecanismo bautizado, Constitución 4b + FICHA-MODELO §7)
- tituloMarked: `Tu Mapa, [acento]hecho con tus respuestas[/acento]`
- mecanismo: "el Mapa de Desconexión"
- bigIdeaMarked: `No te faltan intentos — te faltaba saber [b]de dónde viene tu patrón[/b]. El Mapa lo muestra, y desde ahí das el paso que sigue.`
- pasos:
  1. Respondes unas preguntas — "Sobre cuándo y con quién te desconectas de verdad."
  2. Ves tu Mapa — "Tu patrón, nombrado con tus propias respuestas — no genérico."
  3. Das tu paso — "Uno concreto por semana, empezando contigo misma."
- antesDespues: Antes = "Otra app, otro intento que se apaga a los tres mensajes." · Después = "Tu propio Mapa y un paso claro cada semana."

## 5. LA APP POR DENTRO (mockups reales del recorrido de Sesión 2 — jerarquía nivel 2 de MOCKUPS HONESTOS, 19 §5; reemplazar por screenshots de producción cuando la app exista, pendiente en ESTADO.md)
- tituloMarked: `Tu proceso, [acento]paso a paso[/acento]`
- frames: `/mockups/onboarding.png` "Así respondes al empezar" · `/mockups/home.png` "Tu Mapa de Desconexión" · `/mockups/mapa-en-accion.png` "Tu paso de la semana" · `/mockups/paywall.png` "Así eliges tu plan"

## 6. OFERTA (fuente: FICHA-MERCADO §1 + ESTADO.md → Estrategia de monetización)
- tituloMarked: `Empieza gratis. Sigue por [acento]$0,15 al día[/acento]`
- trialDias: 7 (simplificado a un solo número para ambos planes — el kit no soporta trial distinto por plan; decisión técnica anotada en ESTADO.md)
- Plan anual: $4,17/mes · badge "Mejor valor" · totalAnual "Se cobra US$49,99/año" · ahorro "Más de la mitad de descuento vs. mensual" · descomposicionDia "menos de $0,15 al día"
- Plan mensual: $8,99/mes
- Stack de valor: Tu Mapa de Desconexión completo (12 meses) $96 · Pasos nuevos cada semana, siempre personalizados $40 · Ajuste automático cuando retrocedes, sin culpa $24 → total tachado $160 · nota "Hoy: $4,17/mes (se cobra US$49,99/año)"
- Features (anual y mensual, idénticas): "Tu Mapa completo, actualizado cada semana" · "Un paso nuevo, siempre para ti" · "Ajuste automático si retrocedes" · "Protegido por la Garantía del Primer Mapa" (agregado tras el veredicto del revisor — la garantía debe verse cerca del CTA de compra) · "Cancelas cuando quieras"
- ctaLabel anual y mensual: el mismo en toda la página, "Descubrir mi Mapa gratis" (unificado tras el 2º veredicto del revisor — el plan mensual seguía con verbo distinto)

## 7. GARANTÍA (fuente: objeción de riesgo de la ficha + FICHA-MERCADO §4)
- nombre: "la Garantía del Primer Mapa"
- condicionMarked: `Si en 7 días tu Mapa no te muestra algo real sobre ti, escribes un correo y te devolvemos todo. Sin preguntas.`
- pisoLegal: "Respaldada por la garantía Hotmart de 30 días"

## 8. FAQ (fuente: campo OBJECIONES de la ficha, literal)
1. "¿Esto es otro chatbot que me va a hacer sentir peor por hablarle a una máquina?" → "No: no hay chatbot que finja ser tu amiga. Tu Mapa te muestra tus propios patrones — la meta es que necesites la app cada vez menos."
2. "Ya probé apps así y las abandono. ¿Por qué esta sería distinta?" → "Las otras te dejan sola justo después del match. Vínculo es el después: te dice qué hacer distinto para tu semana real."
3. "No tengo tiempo ni ganas de otra app que me pida 'ser social' como tarea." → "No te manda a socializar. Empieza contigo, con pasos de minutos, no de horas."
4. "¿Y si no me funciona?" → "Tienes 7 días de prueba y la Garantía del Primer Mapa: un correo y te devolvemos todo."
5. "¿Es seguro pagar ahí?" → "El pago lo procesa Hotmart, usado por millones en Latinoamérica. Cancelas cuando quieras en un toque."

## 9. CTA FINAL EMOCIONAL (fuente: deseo #1 identidad de la ficha)
- h2Marked: `Vuelve a [acento]ti[/acento] primero`
- futurePacingMarked: "Un domingo cualquiera, sabes exactamente qué paso dar — y ya no se siente hueco."
- recap: "Garantía del Primer Mapa · 7 días gratis"
- psMarked: `PS: Vínculo te muestra de dónde viene tu desconexión con el Mapa de Desconexión, y te da un paso real cada semana. Hoy entras gratis por 7 días, con la Garantía del Primer Mapa.`

## 10. FOOTER LEGAL (fuente: 47 — contenido de cada página se redacta en Sesión 6/47; por ahora placeholders con pendiente anotado)
- soporteEmail: "hola@vinculo.app" (placeholder — se confirma el dominio real en Sesión 6)
- enlaces: Privacidad `/privacidad` · Términos y Condiciones `/terminos` · Reembolsos `/reembolsos` · Aviso de IA `/aviso-ia`
