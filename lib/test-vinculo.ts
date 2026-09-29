// El test inicial de Vínculo — 12 preguntas repartidas en las 5 categorías del Mapa
// de conexión (Contigo/Familia/Amistad/Comunidad/Propósito), tal como lo define el
// paquete de diseño de la usuaria (App-Test.dc.html + App-Mapa.dc.html, 2026-09-29).
// Cada opción tiene un puntaje 0-3 (0 = vínculo fuerte, 3 = vínculo por despertar);
// el promedio por categoría decide el estado del nodo en el Mapa.

export type Categoria = 'contigo' | 'familia' | 'amistad' | 'comunidad' | 'proposito';

export const CATEGORIAS: Record<Categoria, { nombre: string }> = {
  contigo: { nombre: 'Contigo' },
  familia: { nombre: 'Familia' },
  amistad: { nombre: 'Amistad' },
  comunidad: { nombre: 'Comunidad' },
  proposito: { nombre: 'Propósito' },
};

export interface OpcionPregunta {
  label: string;
  puntaje: 0 | 1 | 2 | 3;
}

export interface Pregunta {
  id: string;
  categoria: Categoria;
  texto: string;
  acento?: string; // frase corta a resaltar en itálica dentro del texto (voz íntima de FICHA-ARTE v2)
  opciones: OpcionPregunta[];
}

export const PREGUNTAS: Pregunta[] = [
  {
    id: 'p1',
    categoria: 'contigo',
    texto: 'Cuando pasas una tarde a solas, ¿qué sientes con más frecuencia?',
    acento: '¿qué sientes con más frecuencia?',
    opciones: [
      { label: 'Calma, me hace bien', puntaje: 0 },
      { label: 'Depende mucho del día', puntaje: 1 },
      { label: 'Inquietud, busco distraerme', puntaje: 2 },
      { label: 'Vacío, como si faltara algo', puntaje: 3 },
    ],
  },
  {
    id: 'p2',
    categoria: 'contigo',
    texto: '¿Qué tan seguido te das un momento de silencio, sin pantallas?',
    acento: 'sin pantallas',
    opciones: [
      { label: 'Casi todos los días', puntaje: 0 },
      { label: 'Algunas veces por semana', puntaje: 1 },
      { label: 'Casi nunca', puntaje: 2 },
      { label: 'No recuerdo la última vez', puntaje: 3 },
    ],
  },
  {
    id: 'p3',
    categoria: 'contigo',
    texto: 'Cuando algo te sale mal, ¿cómo te hablas a ti misma?',
    acento: '¿cómo te hablas a ti misma?',
    opciones: [
      { label: 'Con paciencia, como a alguien que quiero', puntaje: 0 },
      { label: 'A veces duro, a veces suave', puntaje: 1 },
      { label: 'Casi siempre duro', puntaje: 2 },
      { label: 'Prefiero no pensarlo', puntaje: 3 },
    ],
  },
  {
    id: 'p4',
    categoria: 'familia',
    texto: '¿Sientes que puedes mostrarte tal cual eres con tu familia?',
    acento: 'tal cual eres',
    opciones: [
      { label: 'Sí, la mayoría de las veces', puntaje: 0 },
      { label: 'Con algunos, no con todos', puntaje: 1 },
      { label: 'Casi nunca', puntaje: 2 },
      { label: 'Prefiero no acercarme tanto', puntaje: 3 },
    ],
  },
  {
    id: 'p5',
    categoria: 'familia',
    texto: '¿Cuándo fue la última vez que hablaste con tu familia de algo que de verdad te importa?',
    acento: 'de verdad te importa',
    opciones: [
      { label: 'Esta semana', puntaje: 0 },
      { label: 'Hace unas semanas', puntaje: 1 },
      { label: 'No lo recuerdo', puntaje: 2 },
      { label: 'Evito esas conversaciones', puntaje: 3 },
    ],
  },
  {
    id: 'p6',
    categoria: 'amistad',
    texto: '¿Tienes a alguien a quien puedas llamar sin pensarlo dos veces?',
    acento: 'sin pensarlo dos veces',
    opciones: [
      { label: 'Sí, una o más personas', puntaje: 0 },
      { label: 'Tengo a alguien, pero dudo en llamar', puntaje: 1 },
      { label: 'No estoy segura', puntaje: 2 },
      { label: 'No, ahora mismo no', puntaje: 3 },
    ],
  },
  {
    id: 'p7',
    categoria: 'amistad',
    texto: '¿Cómo te sientes rodeada de gente en una reunión o fiesta?',
    acento: 'rodeada de gente',
    opciones: [
      { label: 'Cómoda, disfruto el momento', puntaje: 0 },
      { label: 'Bien, aunque a veces me canso', puntaje: 1 },
      { label: 'Sola, aunque haya mucha gente', puntaje: 2 },
      { label: 'Prefiero no ir', puntaje: 3 },
    ],
  },
  {
    id: 'p8',
    categoria: 'amistad',
    texto: '¿Sueles ser quien propone verse, o esperas a que te inviten?',
    acento: '¿quien propone verse?',
    opciones: [
      { label: 'Yo propongo casi siempre', puntaje: 0 },
      { label: 'Depende de la persona', puntaje: 1 },
      { label: 'Casi siempre espero', puntaje: 2 },
      { label: 'Prefiero no proponer nada', puntaje: 3 },
    ],
  },
  {
    id: 'p9',
    categoria: 'comunidad',
    texto: '¿Sientes que perteneces a algún grupo o comunidad?',
    acento: 'que perteneces',
    opciones: [
      { label: 'Sí, claramente', puntaje: 0 },
      { label: 'A veces, no siempre', puntaje: 1 },
      { label: 'No mucho', puntaje: 2 },
      { label: 'No, para nada', puntaje: 3 },
    ],
  },
  {
    id: 'p10',
    categoria: 'comunidad',
    texto: '¿Qué tan cómoda te sientes pidiendo ayuda cuando la necesitas?',
    acento: 'pidiendo ayuda',
    opciones: [
      { label: 'Lo hago sin problema', puntaje: 0 },
      { label: 'Me cuesta, pero lo hago', puntaje: 1 },
      { label: 'Casi nunca pido ayuda', puntaje: 2 },
      { label: 'Prefiero resolverlo sola siempre', puntaje: 3 },
    ],
  },
  {
    id: 'p11',
    categoria: 'proposito',
    texto: '¿Sientes que lo que haces día a día tiene sentido para ti?',
    acento: 'tiene sentido',
    opciones: [
      { label: 'Sí, la mayor parte del tiempo', puntaje: 0 },
      { label: 'A veces sí, a veces no', puntaje: 1 },
      { label: 'Pocas veces', puntaje: 2 },
      { label: 'Casi nunca', puntaje: 3 },
    ],
  },
  {
    id: 'p12',
    categoria: 'proposito',
    texto: '¿Qué tan seguido haces algo solo porque te nace, sin obligación?',
    acento: 'porque te nace',
    opciones: [
      { label: 'Seguido', puntaje: 0 },
      { label: 'De vez en cuando', puntaje: 1 },
      { label: 'Casi nunca', puntaje: 2 },
      { label: 'No recuerdo la última vez', puntaje: 3 },
    ],
  },
];

export type EstadoNodo = 'fuerte' | 'en-construccion' | 'por-despertar';

export function estadoDePuntaje(promedio: number): EstadoNodo {
  if (promedio <= 1.0) return 'fuerte';
  if (promedio <= 2.0) return 'en-construccion';
  return 'por-despertar';
}

export interface ResultadoCategoria {
  categoria: Categoria;
  promedio: number;
  estado: EstadoNodo;
}

/** respuestas: id de pregunta -> puntaje elegido (0-3). */
export function calcularResultado(respuestas: Record<string, number>): ResultadoCategoria[] {
  const porCategoria: Record<Categoria, number[]> = {
    contigo: [], familia: [], amistad: [], comunidad: [], proposito: [],
  };
  for (const p of PREGUNTAS) {
    const v = respuestas[p.id];
    if (v !== undefined) porCategoria[p.categoria].push(v);
  }
  return (Object.keys(porCategoria) as Categoria[]).map((cat) => {
    const valores = porCategoria[cat];
    const promedio = valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
    return { categoria: cat, promedio, estado: estadoDePuntaje(promedio) };
  });
}

/** La categoría con el promedio más alto (más "por despertar") — el punto de partida sugerido. */
export function categoriaMasDebil(resultado: ResultadoCategoria[]): ResultadoCategoria {
  return resultado.reduce((peor, actual) => (actual.promedio > peor.promedio ? actual : peor), resultado[0]);
}
