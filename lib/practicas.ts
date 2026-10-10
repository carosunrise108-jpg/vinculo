// Contenido de las prácticas del Camino. Fuente: docs/contenido/quietud-guiones.md.
// Cada práctica = ANTES (texto) → LA PRÁCTICA (audio/acción/escritura) → DESPUÉS (preguntas +
// frase para empezar a escribir en el Diario). Los audios se graban aparte y viven en el bucket
// privado `practicas` de Supabase Storage (clave = nombre del archivo sin extensión).
//
// Solo la etapa 1 (Quietud) tiene contenido hoy: el resto de etapas se abre cuando se escriba y
// grabe (ver ETAPAS_DISPONIBLES) — no se muestran prácticas vacías ni se promete lo que no existe.

export type TipoPractica = 'audio' | 'accion' | 'escritura';

export interface AudioPractica {
  clave: string; // nombre del archivo en el bucket, sin extensión
  etiqueta: string;
}

export interface Practica {
  id: string; // ej. 'quietud-01'
  etapa: number;
  numero: number; // 1..N dentro de la etapa
  titulo: string;
  tipo: TipoPractica;
  duracion: string;
  antes: string[];
  audios: AudioPractica[]; // audio: 1 · acción: [apertura, cierre] · escritura: [intro] opcional
  temporizadorMin?: number; // solo acciones guiadas
  escribir?: string[]; // preguntas para escribir (prácticas de escritura)
  despues: string[];
  diarioInicio: string;
  notaSeguridad?: string;
}

export const NOTA_NO_TERAPIA =
  'Vínculo es un espacio de acompañamiento personal. No es terapia ni reemplaza a un profesional. Si estás pasando por un momento muy difícil, busca apoyo profesional: en la app tienes líneas de ayuda de tu país.';

const NOTA_PRACTICA_INTENSA =
  'Si lo que apareció fue muy pesado o te asustó, no tienes que llevarlo sola. Habla con alguien de confianza o consulta las líneas de ayuda de tu país.';

export const PRACTICAS: Practica[] = [
  {
    id: 'quietud-01',
    etapa: 1,
    numero: 1,
    titulo: 'Respiración para llegar',
    tipo: 'audio',
    duracion: '5 min',
    antes: [
      'Hoy no tienes que lograr nada. Solo llegar.',
      'Esta práctica es para que tu cuerpo y tu mente se encuentren en el mismo lugar: aquí, ahora.',
      'Busca un sitio donde nadie te interrumpa. Siéntate cómoda o recuéstate. Si quieres, cierra los ojos.',
    ],
    audios: [{ clave: 'quietud-01', etiqueta: 'Respiración para llegar' }],
    despues: [
      '¿Cómo llegaste a esta práctica y cómo te sientes ahora?',
      '¿En qué parte del cuerpo notaste más tensión o más calma?',
      '¿Qué te dijiste mientras respirabas?',
    ],
    diarioInicio: 'Hoy llegué sintiendo…',
  },
  {
    id: 'quietud-02',
    etapa: 1,
    numero: 2,
    titulo: 'Pausa sin pantallas',
    tipo: 'accion',
    duracion: '10 min',
    antes: [
      'Casi todo el día tenemos algo en las manos: el celular, un mensaje, una notificación. A veces lo usamos para no sentir lo que sentimos.',
      'Hoy vas a darte 10 minutos sin pantallas, sin nada que hacer. No es un castigo: es un regalo.',
      'Deja el celular en otra habitación o boca abajo, lejos de tu mano.',
    ],
    audios: [
      { clave: 'quietud-02-apertura', etiqueta: 'Apertura' },
      { clave: 'quietud-02-cierre', etiqueta: 'Cierre' },
    ],
    temporizadorMin: 10,
    despues: [
      '¿Cuántas veces sentiste el impulso de buscar el celular?',
      '¿Qué creías que ibas a encontrar ahí?',
      '¿Qué apareció cuando no tenías nada que hacer: calma, inquietud, aburrimiento, otra cosa?',
    ],
    diarioInicio: 'Cuando no tuve nada en las manos, sentí…',
  },
  {
    id: 'quietud-03',
    etapa: 1,
    numero: 3,
    titulo: 'Sonidos y silencio',
    tipo: 'audio',
    duracion: '5 min',
    antes: [
      'El silencio total casi no existe: siempre hay algo sonando. Esta práctica es para escuchar, sin juzgar, lo que ya está ahí.',
      'Escuchar es una forma de estar presente.',
    ],
    audios: [{ clave: 'quietud-03', etiqueta: 'Sonidos y silencio' }],
    despues: [
      '¿Qué sonido te sorprendió que estuviera ahí y no lo habías notado?',
      '¿Cómo se sintió el pedacito de silencio entre sonidos?',
      '¿Qué sientes cuando no llenas el silencio con nada?',
    ],
    diarioInicio: 'En el silencio escuché…',
  },
  {
    id: 'quietud-04',
    etapa: 1,
    numero: 4,
    titulo: 'Respiración para soltar tensión',
    tipo: 'audio',
    duracion: '5 min',
    antes: [
      'Muchas veces cargamos el día en el cuerpo sin darnos cuenta: los hombros arriba, la mandíbula apretada, las manos cerradas.',
      'Hoy vas a respirar para soltar, parte por parte. No hay que lograr nada: solo dejar ir lo que puedas.',
    ],
    audios: [{ clave: 'quietud-04', etiqueta: 'Respiración para soltar tensión' }],
    despues: [
      '¿Dónde estaba la tensión que más te sorprendió?',
      '¿Qué crees que estaba tratando de proteger o de cargar esa parte de tu cuerpo?',
      '¿Cómo te sientes ahora comparado con antes?',
    ],
    diarioInicio: 'Mi cuerpo estaba cargando…',
  },
  {
    id: 'quietud-05',
    etapa: 1,
    numero: 5,
    titulo: 'Una tarde a solas, sin llenar el silencio',
    tipo: 'accion',
    duracion: '15 min',
    antes: [
      'Para muchas personas, estar a solas —sobre todo un domingo por la tarde— se siente como un vacío que hay que tapar rápido con una serie, un scroll o un mensaje.',
      'Hoy vamos a probar algo distinto: quedarte 15 minutos a solas, sin música, sin podcast, sin pantallas. Solo tú, y lo que aparezca.',
      'Si en algún momento se vuelve demasiado, puedes parar. Escucharte también incluye cuidarte.',
    ],
    audios: [
      { clave: 'quietud-05-apertura', etiqueta: 'Apertura' },
      { clave: 'quietud-05-cierre', etiqueta: 'Cierre' },
    ],
    temporizadorMin: 15,
    despues: [
      '¿Qué fue lo primero que apareció cuando te quedaste en silencio?',
      '¿Qué parte te costó más? ¿Y cuál te sorprendió para bien?',
      'Si el vacío tuviera una voz, ¿qué te diría que necesita?',
    ],
    diarioInicio: 'Estar a solas hoy se sintió…',
    notaSeguridad: NOTA_PRACTICA_INTENSA,
  },
  {
    id: 'quietud-06',
    etapa: 1,
    numero: 6,
    titulo: 'Qué ruido alimenta mi vacío',
    tipo: 'escritura',
    duracion: '3 min',
    antes: [
      'A veces, sin darnos cuenta, usamos ciertos hábitos para no sentir: el scroll, las compras, el trabajo sin parar, los mensajes que no llevan a nada.',
      'No son "malos": son maneras de cuidarte que aprendiste. Hoy solo vas a mirarlos con curiosidad, sin juzgarte.',
    ],
    audios: [{ clave: 'quietud-06-intro', etiqueta: 'Introducción' }],
    escribir: [
      'Cuando me siento sola o vacía, ¿qué suelo hacer enseguida?',
      '¿Qué app, hábito o costumbre uso para no sentir eso?',
      '¿Qué estaba sintiendo justo antes de buscarlo?',
      '¿Qué me da ese hábito a corto plazo? ¿Y qué me quita?',
    ],
    despues: [
      'Léelo en voz baja, como si lo hubiera escrito alguien que quieres mucho. ¿Qué le dirías?',
      '¿Hay un hábito que, por ahora, solo quieras mirar más de cerca esta semana?',
    ],
    diarioInicio: 'Lo que más me ayuda a no sentir es…, y lo que de verdad necesito es…',
  },
  {
    id: 'quietud-07',
    etapa: 1,
    numero: 7,
    titulo: 'Cierre: lo que ya noté',
    tipo: 'audio',
    duracion: '6 min',
    antes: [
      'Llegaste al final de la primera semana. No importa cuántas prácticas hiciste perfecto: estás aquí.',
      'Hoy vas a mirar con cariño lo que has notado, y agradecerte por haberte dado este tiempo.',
      'Si quieres, ten tu Diario cerca para escribir al terminar.',
    ],
    audios: [{ clave: 'quietud-07', etiqueta: 'Cierre: lo que ya noté' }],
    despues: [
      '¿Qué fue lo que más te sorprendió de ti esta semana?',
      '¿Cuál fue tu práctica favorita y por qué?',
      '¿Qué quieres llevarte de la Quietud a tus días normales?',
    ],
    diarioInicio: 'Querida yo: esta semana descubrí que…',
  },
];

/** Etapas con contenido real. Las demás se muestran como "pronto", sin prácticas inventadas. */
export const ETAPAS_DISPONIBLES = new Set<number>([1]);

export function practicasDeEtapa(etapa: number): Practica[] {
  return PRACTICAS.filter((p) => p.etapa === etapa).sort((a, b) => a.numero - b.numero);
}

/** La práctica que toca. `numero` puede exceder el total (se envuelve: la espiral vuelve a empezar). */
export function practicaDe(etapa: number, numero: number): Practica | null {
  const lista = practicasDeEtapa(etapa);
  if (lista.length === 0) return null;
  return lista[(Math.max(1, numero) - 1) % lista.length];
}
