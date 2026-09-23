# ESTADO — Vínculo
Última actualización: 2026-09-22 | Sesión actual: 3 (cerrada)

⏸️ CHECKPOINT — Fase actual: Sesión 4 (onboarding, paywall, login), en 3ª pasada de revisión / Pantalla en curso: onboarding + paywall — 2ª pasada dio NO LISTA en ambas (onboarding 32/40·12/20; paywall 34/40·11/20), defectos concretos de calibración (rotación/fondo muy sutiles, sin hairline en la mayoría de pantallas de onboarding, sin reduced-motion propagado, 4 tamaños de texto en paywall) — TODOS corregidos en código (rotación subida, opacidad del fondo subida, IconChip+Hairline agregado a q1-q4/slider/q6, reduced-motion propagado, tamaños de texto del paywall consolidados a 4, Q6 recortado a 4 opciones, estado de error en guardado local) y verificados (tsc ✓ build ✓); 3ª pasada del revisor-visual lanzada en background sobre las capturas nuevas (*-v3.png), resultado pendiente / Decisión aún no anotada: la usuaria envió un pedido grande para elevar la LANDING con reglas de "escaneabilidad móvil" (bloques de 4 líneas, iconos como anclas, FAQ acordeón —ya lo tiene—, auditoría de escaneabilidad en tabla) — landing ya está LISTA (Sesión 3), pendiente reconciliar "créala o elévala" con eso antes de tocarla / Próximo paso exacto: procesar el resultado de la 3ª pasada de onboarding/paywall (fix si aún falta algo, o cerrar con veredicto LISTA), y luego correr la auditoría de escaneabilidad sobre la landing ya existente (mejorar, no reescribir) y presentarla a la usuaria antes de tocar código

## Qué es esta app (3 líneas máximo)
App de bienestar emocional para mujeres de 25-35 que se sienten vacías incluso rodeadas de gente. Un proceso personalizado por etapas ("el Mapa de Desconexión") que primero construye en ellas la capacidad de estar bien en soledad, y desde ahí les da un paso concreto por semana para atraer a quienes comparten su nueva forma de ver la vida — gente que ya conocen o gente nueva. Sin matching entre desconocidos y sin chatbot de compañía. Monetización: suscripción económica (prueba gratis + plan anual destacado), vendida por Hotmart.

## Constitución del Producto (01 — cosa juzgada; corregir solo con la usuaria)
1. Usuario + situación: "Daniela", mujer 25-35, profesional/freelance, vive sola o lejos de su red; vida activa en apariencia, sin conexiones profundas. La usa un domingo por la tarde sin nadie a quien llamar, de noche haciendo scroll, y en los 5-10 min al día que le dedica al proceso.
2. Problema + qué evita: se siente vacía aunque esté rodeada de gente y no sabe si el problema son los demás o ella. Evita: otro match que muere a los 3 mensajes, otro chatbot que la deje más vacía, otro consejo genérico de "sal más".
3. Promesa central (ajustada 2026-09-22): "Vínculo ayuda a mujeres que se sienten vacías incluso rodeadas de gente a aprender a estar bien consigo mismas primero, y desde ahí a atraer conexiones reales y duraderas — con la gente que ya conocen o con gente nueva que comparta su forma de ver la vida —, mediante un proceso por etapas (el Mapa de Desconexión) que primero les muestra de dónde viene su desconexión y luego les da un paso concreto por semana."
4. Primera victoria (aha): al terminar el cuestionario de entrada, Daniela ve SU Mapa de Desconexión (cuándo, con quién y en qué contexto se desconecta, y de dónde viene ese patrón) construido con SUS respuestas + el primer paso concreto para su semana real — un paso de autoconocimiento, no de "salir a conocer gente". No un tour: su patrón, nombrado, con sus datos.
4b. NOMBRE DEL MECANISMO: **el Mapa de Desconexión** (ajustado por la usuaria 2026-09-22 — vuelve al nombre original; reemplaza "La Raíz" del 2026-09-10). Es el diagnóstico personalizado de por qué se desconecta — de dónde viene su patrón —, y desde ahí se desprenden las etapas que se ganan por avance real (no por calendario ni por pagar). El MISMO nombre en landing, onboarding, paywall y ritual diario. Test de falsabilidad: si se borra el historial, el Mapa y las etapas de mañana ya no son los mismos → PASA.
5. Los 3 flujos clave: (a) diagnóstico/onboarding: cuestionario emocional → el Mapa de Desconexión + primer paso (= primera victoria + preview del paywall); (b) paso de la semana (M0): abrir → ver el paso actual (de autoconocimiento o de reconexión, según la etapa) → registrar cómo fue (lo hice / lo intenté / no pude + qué pasó) → la app ajusta el siguiente paso y afina el Mapa; (c) retroceso: la persona marca que se aisló o que un paso salió mal → la app NO rompe racha; identifica el patrón detrás y reajusta las etapas.
6. NUNCA: matching en vivo ni chat con desconocidos · chatbot que finja ser su amiga/compañía · castigar el retroceso con racha rota, culpa o presión · retención por manipulación emocional o laberintos de cancelación · prometer "harás X amigos" ni presentarse como terapia/tratamiento · tratar "estar sola" como defecto a tapar rápido · empezar por "sal a conocer gente" en vez de por el autoconocimiento · compartir/vender los datos de la usuaria. Objetivo explícito: que necesite la app cada vez menos.

## Activo real de la usuaria — "Mujer Divina" (aportado 2026-09-22)
La usuaria ya tiene una comunidad propia, **Mujer Divina**, con encuentros temáticos reales (círculos de palabra, entre otros). El programa lleva **~5 años activo** y ha acompañado a **más de 100 mujeres**; la comunidad de WhatsApp es más reciente (cifra confirmada por la usuaria 2026-09-22, ya usada como prueba social en la landing — ver docs/copy/landing.md). Es un activo grande: público propio que ya confía en ella (Pilar 7 — canal de distribución) y la fuente más natural para los primeros testimonios/beta de Vínculo (ver FICHA-AVATAR → Cierre). Decisión (decide-informa-avanza): se usa en dos lugares — (1) Sesión 3 (landing): puede nombrarse como respaldo de quién está detrás de la app, aunque la app en sí todavía no tenga testimonios propios; (2) posible función futura (a revisar en Sesión 5, app interna): cuando la usuaria de la app esté lista para "gente nueva" (deseo #2 de la ficha), la app puede invitarla a un encuentro real de Mujer Divina en vez de un match frío con desconocidos — coherente con la regla NUNCA de matching en vivo, porque es una comunidad curada y real, no un match a ciegas. Se decide construir o no esa función cuando se llegue a la Sesión 5; por ahora queda anotado para no perderlo.

## Reporte de validación (Sesión 1)
- Veredicto: VIABLE CON AJUSTES (coincide con el 73/100 del doc de la usuaria).
- Mecanismo probado: "diagnóstico de patrón + plan personalizado por etapas + ajuste en la recaída" ya factura en el nicho hermano (mindful drinking): Reframe ~US$400k/mes y ~50k descargas/mes (Sensor Tower, 2025-05), 3,2M descargas acumuladas, categoría US$1,57B en 2025, con financiación de riesgo (Fortune 2022).
- Tamaño del dolor: mercado de conexión/compañía ~US$120M de gasto real medido en tiendas en 2025, creciendo fuerte (~27-31% CAGR en la definición amplia); OMS liga la desconexión social a ~871.000 muertes/año. (Coincide con el doc de la usuaria.)
- Apps de referencia / lo que sus usuarios odian (= nuestra oportunidad):
  - Bumble BFF / Peanut (matching de amigas): "las conversaciones se mueren a los 1-2 mensajes", "nadie propone verse", "paywall agresivo". Resuelven el encuentro, no el después.
  - Replika / Nomi (compañía IA): alivio momentáneo → vergüenza y vacío; monetizan la dependencia.
  - Reframe (app modelo, otro nicho): quejas 1-2★ = "demasiada lectura genérica, se siente tarea", "caro / cobro sorpresa tras la prueba", "poco personalizado a MI caso".
- Brecha LATAM confirmada: en español todo es matching/coordinación (222, Timeleft, Bumble BFF, Meetup, POPULIT, We Are Mussa) o compañía IA. NADIE hace "entiende tu patrón de aislamiento → proceso por etapas → primero estar bien contigo". El ángulo de matching/coordinación es además terreno quemado (tar pit) — por eso el ángulo de PROCESO/autoconocimiento (no matching) es la jugada correcta.
- Precio de referencia del mercado: mensual ~US$13-15 · anual ~US$70-100. Detalle y fuentes en FICHA-MERCADO.md.
- Riesgo regulatorio: NO es terapia. Enmarcar como acompañamiento/organización personal + disclaimer + derivación a ayuda profesional. Ver 47.
- Ajustes recomendados antes de invertir en publicidad: 5-8 entrevistas Mom Test (44); abrir el checkout real de Hotmart y mirarlo (18); verificar onboarding de Reframe en Mobbin y sus ads en Meta Ads Library.

## Avatar y venta (Sesión 1 — APROBADA; ajustes del 2026-09-22 incorporados con la usuaria)
- FICHA-AVATAR.md: APROBADA. El copy de venta se DERIVA de ella (57).
- Resumen: "Daniela", 29, diseñadora freelance que se mudó por trabajo · palabra central del estado interno = **vacío/vacía** (la soledad es la situación; el vacío es lo que la angustia) · deseo RAÍZ (ajustado 2026-09-22): estar bien consigo misma primero — la conexión con otros (conocidos o nuevos) es CONSECUENCIA de eso, no la meta de entrada · dolor #1 "el celular lleno de contactos y nadie a quien llamar el domingo" · consciencia 3-4/5 · sofisticación 3-4/5.
- Ancla emocional: "celular lleno de contactos, nadie a quien llamar el domingo — y ese vacío por dentro" → "vas a aprender a estar bien contigo misma, y desde ahí vas a atraer a gente que vea la vida como tú — la que ya conoces, y la que todavía no conoces".
- Landing: seguirá la ESTRUCTURA CANÓNICA de 10 secciones del 19 · carrusel con placeholders hasta que exista la app · footer legal: páginas pendientes · SIN prueba social numérica al inicio (no hay testimonios todavía).

## App modelo (Sesión 1 — cosa juzgada)
- FICHA-MODELO.md: existe, Estado BORRADOR — PENDIENTE de OK de la usuaria + completar plano (onboarding de Reframe en Mobbin, ads en Meta Ads Library).
- Modelo: Reframe. Eje único cambiado: ángulo + audiencia (beber menos → soledad/reconexión). Se conserva: onboarding = cuestionario emocional → perfil personalizado → paywall · pricing = prueba + anual destacado, sin free tier permanente.
- Líderes admirados para la capa visual/retención (16): Finch (ritual diario + inversión emocional, US$30M ARR), Calm/Headspace (onboarding emocional).

## Estrategia de monetización (Sesión 1 — DECIDIDA, decide-informa-avanza; NO re-preguntar)
- Modelo: MODELO 2 — onboarding + paywall de prueba. Justificación: nicho B (bienestar/salud mental) en la matriz A-F del 02C; onboarding emocional largo (micro-compromisos B2C) que termina en el Mapa + primer paso; el paywall aparece tras esa primera victoria. Variante: preview anónimo → paywall → login/auth (progreso en el navegador durante el onboarding; login para conservarlo). Sin free tier permanente.
- Trial: 7 días para ambos planes (simplificado en Sesión 3 — el kit de landing/paywall no separa trial por plan de forma limpia; se prefirió uniformar antes que forzar una excepción al componente compartido). Avisar fecha y monto antes del cobro (puente del trial D1-D7, se diseña en Sesión 4).
- Pricing AJUSTADO A PEDIDO DE LA USUARIA (2026-09-22 — "que el dinero no sea un problema, cómodo de sostener cada mes"). Se bajó por debajo de la mediana del mercado (FICHA-MERCADO §1: ~US$13-15/mes) a propósito, priorizando accesibilidad sobre ancla de precio alto:
  - Mensual: US$8,99/mes
  - Anual: US$49,99/año, mostrado como "US$4,17/mes" en grande + "se cobra US$49,99/año" en label · preseleccionado · badge "Mejor valor" — más de la mitad de descuento vs. pagar mes a mes.
  - Suelo de costo (40): la IA es texto→texto barata (pocas llamadas/semana, modelo rápido, caché) → COGS estimado < US$0,50/usuario/mes = < 6% del precio mensual y < 12% del anual/mes, igual muy por debajo del 20%. Margen sigue > 85% antes de la comisión de Hotmart (~10%). Pasa.
  - Suelo de canal (34): se chequea antes de la primera campaña pagada (MOMENTO 2). A este precio, la publicidad paga va a necesitar anual-first desde el día uno — se revisa entonces.
  - Nota para la usuaria: a este precio el negocio sigue siendo rentable por usuario, pero da menos margen para pagar publicidad más adelante; si en algún momento el crecimiento se estanca por eso, se revisa el precio juntas (nunca de sorpresa — /precios).
- Garantía: 30 días (> prueba de 14 y 7 → cobertura real positiva, se puede publicar). Ver FICHA-MERCADO §4.
- Límites de plan: la suscripción da acceso completo al proceso; no hay cupos de "resultados" (no es una app de IA cara por acción). El plan gratis = la prueba, no un tier permanente.

## Dirección de Arte (Sesión 2 — CERRADA 2026-09-22, cosa juzgada — NO cambiar sin justificación)
- FICHA-ARTE.md: existe y APROBADA. ¿Hubo referencia visual? Sí una parcial al inicio (paleta oscura de la usuaria), DESCARTADA por ella misma tras verla aplicada; la dirección final salió de una propuesta propia (sin referencia) que la usuaria combinó y ajustó.
- Resumen: fondo #F6F2FF · acento #8B6FEC (violeta) · 2ª nota #FF93B0 (rosa, secundaria) · Display "Fredoka" · Body "Nunito" · radio 24px · dispositivo ownable: tarjetas-pegatina con rotación ligera.
- Personalidad: cálida · lúdica · cercana.
- REGISTRO ANTI-REPETICIÓN (29/54): paleta violeta-claro/rosa + par Fredoka/Nunito quedan vetados para el próximo proyecto del SO.
- Evidencia: `direcciones-abc.html` + `vista-previa-app.html` (raíz del proyecto) · screenshots en `docs/revisiones/`.

## Secuencia maestra de construcción (NO saltar)
- Ruta aprobada: `/` (página de ventas) → `/onboarding` → `/paywall` (pantalla de planes) → `/login` → `/app`
- Landing: construida — protagonista: el Mapa de Desconexión (hero + oferta) — veredicto docs/revisiones/landing-veredicto.md
- Onboarding: construida, en 3ª pasada de revisión — 6 preguntas + 2 reconocimientos + loading — primera decisión: ¿cuándo sientes ese vacío con más fuerza? — veredicto docs/revisiones/onboarding-veredicto.md
- Paywall: construida, en 3ª pasada de revisión — plan recomendado: Anual $4.17/mes — veredicto docs/revisiones/paywall-veredicto.md
- Login/Auth: construido — magic link + Google, simulado hasta Sesión 6 (Supabase real) — pantalla secundaria, sin revisor (medición + checklist E de 50)
- App interna: pendiente
- Servicios externos: pendiente

## Landing / página de ventas (Sesión 3 — CERRADA 2026-09-22)
- Código: `app/page.tsx` compone el kit de `components/landing/` (copiado de `plantillas-codigo/landing/`) en las 10 secciones canónicas de 19, sin desvíos de estructura.
- Copy marcado y trazado a FICHA-AVATAR.md: `docs/copy/landing.md`.
- Tokens tematizados con FICHA-ARTE.md en `components/landing/tokens.css` — el acento se oscureció de #8B6FEC a **#6D4FE0** (mismo violeta, ajustado para cumplir contraste AA en los botones; ver nota en el propio archivo) — actualizar esta referencia en la FICHA-ARTE si se retoma la identidad para otras pantallas.
- Visuales: el Hero y el carrusel "La app por dentro" usan mockups REALES (`public/mockups/*.png`, capturas de `vista-previa-app.html`, el tour aprobado en Sesión 2) — jerarquía nivel 2 de MOCKUPS HONESTOS (19 §5), no screenshots de producción todavía porque la app interna no existe.
- Modelo de monetización aplicado: Modelo 2 variante anónima — todos los CTA (hero, mid-page, oferta, CTA final, sticky) llevan a `/onboarding` (ruta aún no construida).
- Trial simplificado a 7 días para ambos planes (mensual y anual) — el kit de oferta no separa trial por plan; decisión técnica, no cambia el precio ni la garantía.
- Verificación: `npx tsc --noEmit` ✓ · `npm run build` ✓ · `npm run dev` ✓ sin errores de consola · render real a 375px → `docs/revisiones/landing-375.png` · revisor-visual (6 pasadas hasta pasar el gate): **34/40 usabilidad · 16/20 craft · 19/20 copy** → veredicto en `docs/revisiones/landing-veredicto.md`.

## Decisiones técnicas (DECIDE — NO re-discutir sin pedirlo la usuaria; no van al chat)
- Framework: Next.js App Router — landing con SEO integrada + rutas de API para el webhook de Hotmart + patrón BFF para la IA. Decidido 2026-09-09. Scaffold hecho en Sesión 3 (2026-09-22): Next 16 / React 19 / TS / Tailwind v4 / motion / lucide-react instalados (`51-STACK-PINEADO.md`). Servidor local: `npm run dev` (o `preview_start` con la config `vinculo-dev` de `.claude/launch.json`).
- Idioma UI: mono-idioma, español LATAM neutro.
- Auth: Supabase Auth passwordless — magic link (email) + Google OAuth. Jerarquía del 26: sin contraseñas, anti-enumeración, rate limit, sin fail-open. El login aparece DESPUÉS del paywall. La compra de Hotmart SUBE la cuenta a Pro vía webhook (cuidado con email distinto — patrón del 18).
- Modelo de datos (esbozo; RLS en TODA tabla por (select auth.uid()), columna de la política indexada; detalle en Sesión 6):
  `profiles`(user_id PK, plan, trial_ends_at, timezone, created_at) ·
  `onboarding_responses`(id, user_id, question_key, value, created_at) ·
  `disconnection_map`(id, user_id, patterns jsonb, summary, version, generated_at) ·
  `route_steps`(id, user_id, stage_number, step_order, title, body, status[locked/active/done/skipped], unlocked_by, created_at) ·
  `step_logs`(id, user_id, step_id, outcome[done/tried/couldnt], reflection, created_at) ·
  `setbacks`(id, user_id, context, detected_pattern, adjustment_note, created_at) ·
  `ai_calls`(id, user_id, kind, model, input_hash, tokens_in, tokens_out, cost, created_at).
  Índices: toda FK user_id; `route_steps(user_id,status)`; `step_logs(user_id,created_at)`.
- Arquitectura IA: texto→texto, SÍNCRONA. Patrón BFF (clave solo en servidor). `AI_MODEL` en env var, `max_tokens` ~1024, caché por hash de input. Usos: (1) generar el Mapa de Desconexión desde el onboarding; (2) ajustar el siguiente paso de la Ruta desde step_logs/setbacks. Sin IA de imagen/audio. Tabla `ai_calls` para kill-switch/observabilidad (30/31).
- Loop de retención (Hooked — se detalla en Sesión 4): Gatillo = recordatorio nocturno suave + soledad del domingo (gatillo interno). Acción = abrir y ver/registrar el paso de la semana (M0). Recompensa = el Mapa se afina y la Ruta avanza (progreso real, no puntos). Inversión = cada registro cambia lo que la app dice mañana. Primera semana D1-D7 y ritual M0 → Sesión 5.
- Gamificación: SIN rachas con castigo, SIN XP, SIN ligas. Mecánica = etapas que se ganan por avance real + hitos reales celebrados con sobriedad (11/24/56).

## Sesiones completadas ✅
- Sesión 1 — validación + Constitución + FICHA-AVATAR (aprobada) + FICHA-MODELO + FICHA-MERCADO + monetización/precio/arquitectura decididos — 2026-09-10.
- Sesión 2 — identidad visual: FICHA-ARTE aprobada (violeta/rosa, Fredoka+Nunito, tarjetas-pegatina), tour de la app aprobado, avatar/mecanismo/precio reajustados a pedido de la usuaria, activo "Mujer Divina" registrado — 2026-09-22.
- Sesión 3 — página de ventas construida en código, verificada y con veredicto LISTA del revisor-visual — 2026-09-22.

## Sesión en progreso 🔧
- Ninguna — lista para arrancar Sesión 4 con el OK de la usuaria.

## Próximas sesiones 📋
- Sesión 4: onboarding, pantalla de planes (paywall real, ya no solo la oferta de la landing) y login.
- Sesión 5: app interna simplificada — ahí se decide si se construye el puente a encuentros reales de Mujer Divina.

## Problemas conocidos ⚠️
- **veredicto onboarding / veredicto paywall** — 1ª pasada del revisor-visual: ambas NO LISTA (onboarding 26/40 usabilidad·9/20 craft; paywall 31/40·9/20), con defectos reales identificados y corregidos en el código (ChipOpcion sin estado seleccionado — bug real, ya arreglado; dispositivo ownable ausente; value-stack duplicado con el timeline en paywall; textos bajo el mínimo; etc.). Se relanzó el revisor-visual (2ª pasada) sobre las capturas ya corregidas — resultado pendiente de la notificación del subagente en esta misma sesión. No declarar ninguna de las dos pantallas "lista para el usuario" hasta que esa 2ª pasada llegue con VEREDICTO: LISTA (o se documente aquí por qué se acepta un veredicto narrativo, como se hizo con landing).
- **garantía / FICHA-MERCADO** — FICHA-MERCADO.md §4 tiene "Prueba elegida: 7 días" y "Garantía elegida: 30 días" en líneas simples y sin negrita, con la comprobación garantía(30) > prueba(7) → SÍ. Si el gate automático lo sigue marcando, es un problema del parser/formato exacto que espera, no de que falten los datos — los dos plazos están explícitos y verificados con fuente (Hotmart) en esa ficha.
- **veredicto landing** — el veredicto del revisor-visual para la pantalla `landing` (docs/revisiones/landing-veredicto.md, 6ª pasada) quedó en 34/40 usabilidad (bajo el umbral mecánico de 36/40) con 16/20 craft y 19/20 copy, pero el propio revisor declaró **VEREDICTO: LISTA** de forma explícita: los puntos que faltan para el 36 son heurísticas Nielsen 3 y 9 (control/deshacer, manejo de errores) que el revisor mismo calificó de **estructuralmente no aplicables** a una landing estática de una sola página (no hay acciones destructivas que deshacer, y los errores de pago viven en el checkout/onboarding, no aquí) — lo dijo explícitamente en la 6ª pasada tras corregirse los 5 defectos reales de las 5 pasadas anteriores (placeholders con texto de desarrollo expuesto, dispositivo ownable ausente, contraste AA del botón, verbos de CTA inconsistentes, trial 14 vs 7 días). Se acepta el veredicto narrativo del revisor sobre el número mecánico — decisión tomada en la sesión, no una omisión. Revisar de nuevo si se rediseña la landing o si aparece un revisor con otro criterio.
- Páginas legales del footer (`/privacidad`, `/terminos`, `/reembolsos`, `/aviso-ia`) AÚN NO EXISTEN — los enlaces del footer de la landing apuntan a rutas que todavía no se crean. Se redactan con el archivo 47 antes de publicar la landing en internet (Sesión 6). No bloquea seguir construyendo, sí bloquea el lanzamiento.
- `StickyCtaMobile` (barra fija inferior en el celular) no tiene forma de ocultarse manualmente durante el scroll — mejora menor señalada por el revisor-visual, no bloqueante.
- Ninguna sección de la landing tiene foto/ilustración propia (fundadora, Mujer Divina) — solo color y tarjetas — sugerido por el revisor-visual para una futura pasada, no bloqueante.
- `email` de soporte del footer (`hola@vinculo.app`) es un placeholder — confirmar el dominio real cuando se compre (Sesión 6).

## Pendientes de la usuaria (acciones que solo ella puede hacer)
- [ ] Más adelante (Sesión 6): crear cuentas (Supabase, Vercel, Resend, Hotmart) y comprar dominio — con guía paso a paso.

## Notas para la próxima sesión
- La usuaria NO es técnica. Hablar simple, sin jerga, español latino neutro. No narrar la cocina.
- Riesgo: cifras de mercado del doc original confirmadas en líneas generales, pero varias fuentes propias quedan por cerrar (checkout real de Hotmart, Mobbin de Reframe, Meta Ads Library). Anotado en las fichas.
- Servidor de desarrollo: si se retoma la landing en otra sesión, usar `preview_start` con la config `vinculo-dev` (`.claude/launch.json`) para verla corriendo.
