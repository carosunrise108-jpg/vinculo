// Recursos de ayuda profesional por país — VERIFICADOS por búsqueda web el 2026-09-29,
// nunca inventados (Regla de Oro: un número de este tipo sin fuente es un número
// inventado). Úsalo cuando el Mapa/Test muestre señales fuertes de soledad o
// autocrítica dura — nunca como diagnóstico, solo como puerta a ayuda real.
// Re-verificar antes de publicar en producción: estas líneas pueden cambiar.

export interface LineaAyuda {
  nombre: string;
  contacto: string;
  disponibilidad: string;
}

export interface RecursoPais {
  pais: string;
  lineas: LineaAyuda[];
  fuente: string;
}

// Fuentes: Ministerio de Salud de cada país / Infobae / Terapify (búsqueda 2026-09-29).
export const RECURSOS_POR_PAIS: Record<string, RecursoPais> = {
  CO: {
    pais: 'Colombia',
    lineas: [
      { nombre: 'Línea Nacional de Prevención del Suicidio', contacto: '192', disponibilidad: '24/7, gratuita' },
      { nombre: 'Línea 106', contacto: '106 (o WhatsApp 300 754 8933)', disponibilidad: '24/7, gratuita' },
    ],
    fuente: 'Ministerio de Salud de Colombia, Resolución 347 de 2026 (código dorado) — verificado 2026-09-29',
  },
  MX: {
    pais: 'México',
    lineas: [
      { nombre: 'Línea de la Vida (CONADIC)', contacto: '800 911 2000', disponibilidad: '24/7, gratuita' },
      { nombre: 'SAPTEL (Cruz Roja)', contacto: '55 5259 8121', disponibilidad: '24/7' },
    ],
    fuente: 'CONADIC / Cruz Roja Mexicana — verificado 2026-09-29',
  },
  AR: {
    pais: 'Argentina',
    lineas: [
      { nombre: 'Línea Nacional de Salud Mental', contacto: '0800-999-0091', disponibilidad: '24/7, gratuita' },
      { nombre: 'Centro de Asistencia al Suicida (CAS)', contacto: '135 (AMBA) / 0800 345 1435', disponibilidad: '24/7, gratuita' },
    ],
    fuente: 'Ministerio de Salud de Argentina — verificado 2026-09-29',
  },
  CL: {
    pais: 'Chile',
    lineas: [
      { nombre: 'Línea de Prevención del Suicidio (MINSAL)', contacto: '*4141', disponibilidad: '24/7' },
      { nombre: 'Salud Responde', contacto: '600 360 7777', disponibilidad: '24/7' },
    ],
    fuente: 'Ministerio de Salud de Chile — verificado 2026-09-29',
  },
  PE: {
    pais: 'Perú',
    lineas: [{ nombre: 'Línea 113 Salud (MINSA), opción salud mental', contacto: '113, opción 5', disponibilidad: '24/7' }],
    fuente: 'MINSA Perú — verificado 2026-09-29',
  },
  PY: {
    pais: 'Paraguay',
    lineas: [{ nombre: 'Línea de crisis en salud mental', contacto: '155', disponibilidad: 'Verificar horario' }],
    fuente: 'Ministerio de Salud Pública de Paraguay — verificado 2026-09-29',
  },
};

// Para cualquier país no listado arriba: directorio internacional verificado,
// permite buscar por país. No es nuestro — es un servicio externo reconocido.
export const DIRECTORIO_GENERAL = {
  nombre: 'findahelpline.com',
  url: 'https://findahelpline.com/es-ES',
  descripcion: 'Directorio internacional de líneas de ayuda — busca la de tu país.',
};
