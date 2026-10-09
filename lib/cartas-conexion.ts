// Cartas íntimas del Mapa de conexión — una por categoría. Se muestran donde antes solo decía
// "tu vínculo con X es el que más espacio pide": ahora explican POR QUÉ conectar importa y qué
// se gana, en tono de diario/carta (pedido de la usuaria 2026-10-09). Sin promesas clínicas ni
// cifras: el lenguaje describe experiencias, no resultados médicos (Constitución del Producto:
// nunca presentarse como terapia).

import type { Categoria } from '@/lib/test-vinculo';

export const POR_QUE_CONECTAR =
  'Sentirnos conectadas —con nosotras, con nuestra gente, con algo que nos mueve— suele ser lo que hace que la vida se sienta habitable. No es un lujo ni una tarea más: es lo que nos sostiene en los días buenos y en los difíciles.';

export interface Carta {
  titulo: string;
  porQue: string;
  beneficios: string[];
  invitacion: string;
}

export const CARTAS: Record<Categoria, Carta> = {
  contigo: {
    titulo: 'Volver a ti',
    porQue:
      'Antes de buscar a nadie, hay alguien que te está esperando: tú. Casi siempre la soledad más pesada no es la de estar sin gente, sino la de estar lejos de una misma. Tu Mapa dice que ahí hay un espacio que pide cariño. Eso no es un defecto: es una puerta.',
    beneficios: [
      'Estar a solas empieza a sentirse como compañía, no como vacío.',
      'Dejas de esperar que otros llenen lo que primero puedes habitar tú.',
      'Escuchas mejor lo que sientes y lo que de verdad quieres.',
      'Las demás relaciones se vuelven más ligeras, porque ya no cargan con todo.',
    ],
    invitacion: 'Querida tú: no hay prisa. Un poco cada día, con suavidad. Aquí te acompaño.',
  },
  familia: {
    titulo: 'Mirar tus raíces',
    porQue:
      'En la familia aprendimos las primeras formas de querer y de sentirnos queridas, y también quedaron algunos silencios a medias. Tu Mapa dice que aquí hay un espacio por tender. No se trata de arreglar a nadie ni de que todo sea perfecto: se trata de entender de dónde vienes para elegir cómo quieres estar.',
    beneficios: [
      'Entiendes mejor por qué reaccionas como reaccionas.',
      'Puedes poner límites y cercanía con más calma.',
      'Sueltas cargas que quizá nunca fueron tuyas.',
      'Se abre la posibilidad de acercarte a tu ritmo, sin presión.',
    ],
    invitacion:
      'Empezaremos por ti, escuchándote, antes de cualquier conversación difícil. Sin culpa y sin obligación.',
  },
  amistad: {
    titulo: 'Abrir la puerta a tu gente',
    porQue:
      'Las amistades son la familia que elegimos, y para muchas personas es donde más se siente la distancia: tener mil contactos y nadie a quien llamar sin pensarlo. Tu Mapa dice que este lazo pide atención. Probablemente no hay nada malo en ti: conectar de verdad se aprende, se practica y se cuida.',
    beneficios: [
      'Sentir que tienes a alguien a quien escribir en un mal día.',
      'Conversaciones que no se apagan a los tres mensajes.',
      'Menos miedo a pedir o a proponer un plan.',
      'Compañía que suma, no que cansa.',
    ],
    invitacion:
      'Primero nos acercamos a ti; después, paso pequeño a paso pequeño, a quienes ya están y a quienes están por llegar.',
  },
  comunidad: {
    titulo: 'Encontrar tu lugar',
    porQue:
      'Pertenecer es sentir que tu presencia importa en algún sitio, aunque sea un grupo pequeño. Tu Mapa dice que ese lugar todavía se siente lejano. Le pasa a muchas personas que se sienten distintas o que llevan tiempo yendo por su cuenta, y se puede construir con calma.',
    beneficios: [
      'Sentirte parte de algo más grande que tu día a día.',
      'Pedir ayuda sin sentir que molestas.',
      'Compartir lo que vives y encontrar eco.',
      'Más apoyo en los momentos difíciles.',
    ],
    invitacion:
      'No tienes que encajar en todas partes: solo encontrar un espacio donde puedas ser tú. Lo iremos buscando juntas.',
  },
  proposito: {
    titulo: 'Recordar lo que te mueve',
    porQue:
      'Cuando los días se vuelven una lista de obligaciones, es fácil perder de vista para qué haces lo que haces. Tu Mapa dice que ahí hay un espacio por reencontrar. No necesitas una gran misión: a veces el propósito empieza con algo pequeño que haces solo porque te nace.',
    beneficios: [
      'Los días se sienten con más sentido, no solo con más tareas.',
      'Te cuesta menos decidir qué sí y qué no.',
      'Reaparece la energía para lo que te importa.',
      'Te acercas a la gente desde lo que de verdad te mueve.',
    ],
    invitacion:
      'Vamos a escuchar qué te llama, con curiosidad y sin exigirte nada.',
  },
};
