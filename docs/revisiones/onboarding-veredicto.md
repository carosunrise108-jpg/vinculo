# VEREDICTO revisor-visual — onboarding
Fecha: 2026-09-22 00:00
Screenshot: docs/revisiones/onboarding-q1.png (+ onboarding-q2.png, onboarding-recon1.png, onboarding-slider.png, onboarding-recon2.png, onboarding-loading.png)
Usabilidad: 26/40
Craft: 9/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [Chips q1-q6] El estado "seleccionado" nunca se renderiza — page.tsx nunca pasa la prop `seleccionado` a `<ChipOpcion>` (grep confirma 0 usos); el usuario toca una opción y no ve borde/fondo acento ni check durante los 300ms antes de avanzar → pasar `seleccionado={respuestas.campo === op}` a cada ChipOpcion.
2. [Fondo de las 6 pantallas] Fondo plano #F6F2FF sin mesh/gradiente ni sombras tintadas de violeta que exige FICHA-ARTE — incumple el GATE DE DETALLES PREMIUM ítem 5 (fondo con profundidad) → aplicar degradé/mesh radial sutil y sombras tintadas en chips y tarjeta héroe.
3. [Chips y tarjetas de reconocimiento] El dispositivo ownable de FICHA-ARTE ("tarjetas-pegatina", rotación alternada -1.2°/+1° + relieve soft-3D) no se aplica en ninguna pantalla — cards perfectamente rectas, apariencia genérica/intercambiable con cualquier otra app → aplicar la rotación y el relieve definidos en la ficha.
4. [Mitad inferior de q1, q2, q4] Contenido anclado arriba deja ~50% de la pantalla vacía sin motivo (viola la regla de espaciado: "si sobra espacio, centrar o dar más aire, nunca vacío muerto abajo") → centrar verticalmente el bloque pregunta+chips o llenar con contexto visual.
5. [Titulares de las 6 pantallas] Bold completo pero sin ninguna palabra resaltada en color de acento, y sin hairline degradé visible en ningún elemento — incumple gate de detalles premium ítems 1 y 2 → resaltar 1-3 palabras clave del titular en var(--accent) y añadir un hairline degradé en un elemento clave.
