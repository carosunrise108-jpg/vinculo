'use client';

// Página de ventas de Vínculo — compuesta desde el KIT CANÓNICO (plantillas-codigo/landing/
// → components/landing/), en el orden de la ESTRUCTURA CANÓNICA de 19-PAGINA-DE-VENTAS.md.
// Copy MARCADO trazado a FICHA-AVATAR.md — fuente completa en docs/copy/landing.md.
// Tokens tematizados desde FICHA-ARTE.md en components/landing/tokens.css.
//
// Modelo de monetización: MODELO 2, variante anónima (02C/ESTADO.md) — el CTA lleva a
// /onboarding, nunca al checkout desde el hero.

import { Phone, Users, MessageCircleOff, CircleHelp } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';

const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Descubrir mi Mapa gratis';

export default function LandingVinculo() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* Dispositivo ownable de FICHA-ARTE.md: tarjetas-pegatina con rotación ligera
          alternada — se aplica aquí, a nivel página, sin tocar el kit compartido. */}
      <style>{`
        #problema li:nth-of-type(odd) { transform: rotate(-2.4deg) !important; box-shadow: 0 10px 22px -8px color-mix(in oklab, var(--accent) 35%, transparent) !important; }
        #problema li:nth-of-type(even) { transform: rotate(2deg) !important; box-shadow: 0 10px 22px -8px color-mix(in oklab, var(--accent) 35%, transparent) !important; }
      `}</style>

      {/* 1. HERO */}
      <Hero
        appName="Vínculo"
        loginHref="/entrar"
        h1Marked="Conócete primero. Todo lo demás [acento]llega solo[/acento]"
        subtitleMarked="Tu Mapa de Desconexión te muestra tu patrón y te da [b]un paso semanal[/b]"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>De la creadora de Mujer Divina — más de 100 mujeres acompañadas en 5 años</span>}
        visualPlaceholderSugerencia="captura de la pantalla principal con el Mapa de Desconexión ya generado"
        visual={
          // Mockup real del recorrido aprobado en Sesión 2 (vista-previa-app.html) —
          // jerarquía nivel 2 de MOCKUPS HONESTOS (19 §5): reproduce el mecanismo real
          // con contenido real, no es screenshot de producción todavía (pendiente en ESTADO.md).
          <img
            src="/mockups/home.png"
            alt="Tu Mapa de Desconexión, con tu paso de hoy"
            width={620}
            height={1300}
            className="h-auto w-full"
          />
        }
      />

      {/* 2. PROBLEMA */}
      <Problema
        id="problema"
        titulo="¿Te suena?"
        preguntas={[
          { icon: Phone, textoMarked: '¿Tienes el celular lleno de contactos y nadie a quien llamar?' },
          { icon: Users, textoMarked: '¿Sientes que estás de más incluso rodeada de gente?' },
          { icon: MessageCircleOff, textoMarked: '¿Otra conversación que muere a los tres mensajes?' },
          { icon: CircleHelp, textoMarked: '¿Ya no sabes si el problema eres tú?' },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'Cada mes que sigue igual son otros [acento]4 domingos vacíos[/acento] que no vuelven.',
          'En un año son casi [b]50 domingos[/b] sintiendo que ya se te pasó el momento.',
          'Otra app de match no lo arregla: [b]más conversaciones no es más conexión[/b].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'El celular lleno de contactos y nadie a quien llamar.',
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo vacío — con 6 meses menos.',
        }}
      />

      {/* 4. SOLUCIÓN */}
      <Solucion
        tituloMarked="Tu Mapa, [acento]hecho con tus respuestas[/acento]"
        mecanismo="el Mapa de Desconexión"
        bigIdeaMarked="No te faltan intentos — te faltaba saber [b]de dónde viene tu patrón[/b]. El Mapa lo muestra, y desde ahí das el paso que sigue."
        pasos={[
          { titulo: 'Respondes unas preguntas', detalle: 'Sobre cuándo y con quién te desconectas de verdad.' },
          { titulo: 'Ves tu Mapa', detalle: 'Tu patrón, nombrado con tus propias respuestas — no genérico.' },
          { titulo: 'Das tu paso', detalle: 'Uno concreto por semana, empezando contigo misma.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Otra app, otro intento que se apaga a los tres mensajes.',
          labelDespues: 'Después',
          despues: 'Tu propio Mapa y un paso claro cada semana.',
        }}
      />

      {/* 5. LA APP POR DENTRO — mockups reales del recorrido de Sesión 2 (jerarquía
          nivel 2 de MOCKUPS HONESTOS, 19 §5); se reemplazan por screenshots de la
          app en producción cuando exista (Sesión 5/6, pendiente en ESTADO.md) */}
      <AppPorDentro
        tituloMarked="Tu proceso, [acento]paso a paso[/acento]"
        frames={[
          { src: '/mockups/onboarding.png', alt: 'Una pregunta del inicio', label: 'Así respondes al empezar' },
          { src: '/mockups/home.png', alt: 'Tu Mapa de Desconexión', label: 'Tu Mapa de Desconexión' },
          { src: '/mockups/mapa-en-accion.png', alt: 'Tu paso de la semana', label: 'Tu paso de la semana' },
          { src: '/mockups/paywall.png', alt: 'Así eliges tu plan', label: 'Así eliges tu plan' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA — trial simplificado a 7 días para ambos planes (el kit no separa
          trial por plan; decisión técnica anotada en ESTADO.md) */}
      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]$0,15 al día[/acento]"
        trialDias={7}
        stack={{
          lineas: [
            { resultado: 'Tu Mapa de Desconexión completo (12 meses)', valor: '$96' },
            { resultado: 'Pasos nuevos cada semana, siempre personalizados', valor: '$40' },
            { resultado: 'Ajuste automático cuando retrocedes, sin culpa', valor: '$24' },
          ],
          totalTachado: '$160',
          nota: 'Hoy: $4.17/mes (se cobra US$49.99/año)',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'MEJOR VALOR',
          precioMes: '$4.17',
          totalAnual: 'Se cobra US$49.99/año',
          ahorro: 'Más de la mitad de descuento vs. mensual',
          descomposicionDia: 'menos de $0.15 al día',
          ctaLabel: CTA_LABEL,
          ctaHref: CTA_HREF,
          features: [
            'Tu Mapa completo, actualizado cada semana',
            'Un paso nuevo, siempre para ti',
            'Ajuste automático si retrocedes',
            'Protegido por la Garantía del Primer Mapa',
            'Cancelas cuando quieras',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$8.99',
          ctaLabel: CTA_LABEL,
          ctaHref: CTA_HREF,
          features: [
            'Tu Mapa completo, actualizado cada semana',
            'Un paso nuevo, siempre para ti',
            'Ajuste automático si retrocedes',
            'Protegido por la Garantía del Primer Mapa',
            'Cancelas cuando quieras',
          ],
        }}
      />

      {/* 7. GARANTÍA */}
      <Garantia
        nombre="la Garantía del Primer Mapa"
        condicionMarked="Si en 7 días tu Mapa no te muestra algo real sobre ti, escribes un correo y te devolvemos todo. Sin preguntas."
        pisoLegal="Respaldada por la garantía Hotmart de 30 días"
      />

      {/* 8. FAQ */}
      <Faq
        items={[
          {
            pregunta: '¿Esto es otro chatbot que me va a hacer sentir peor por hablarle a una máquina?',
            respuestaMarked:
              'No: no hay chatbot que finja ser tu amiga. Tu Mapa te muestra [b]tus propios patrones[/b] — la meta es que necesites la app cada vez menos.',
          },
          {
            pregunta: 'Ya probé apps así y las abandono. ¿Por qué esta sería distinta?',
            respuestaMarked:
              'Las otras te dejan sola justo después del match. Vínculo es el después: te dice [b]qué hacer distinto[/b] para tu semana real.',
          },
          {
            pregunta: 'No tengo tiempo ni ganas de otra app que me pida "ser social" como tarea.',
            respuestaMarked: 'No te manda a socializar. Empieza contigo, con pasos de minutos, no de horas.',
          },
          {
            pregunta: '¿Y si no me funciona?',
            respuestaMarked:
              'Tienes 7 días de prueba y la Garantía del Primer Mapa: [b]un correo y te devolvemos todo[/b].',
          },
          {
            pregunta: '¿Es seguro pagar ahí?',
            respuestaMarked:
              'El pago lo procesa Hotmart, usado por millones en Latinoamérica. Cancelas cuando quieras en un toque.',
          },
        ]}
      />

      {/* 9. CTA FINAL EMOCIONAL */}
      <CtaFinal
        h2Marked="Vuelve a [acento]ti[/acento] primero"
        futurePacingMarked="Un domingo cualquiera, sabes exactamente qué paso dar — y ya no se siente hueco."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Garantía del Primer Mapa · 7 días gratis"
        psMarked="PS: Vínculo te muestra de dónde viene tu desconexión con el Mapa de Desconexión, y te da un paso real cada semana. Hoy entras gratis por 7 días, con la Garantía del Primer Mapa."
      />

      {/* 10. FOOTER LEGAL — páginas legales pendientes: se crean con 47 antes de publicar (ESTADO.md) */}
      <FooterLegal
        appName="Vínculo"
        soporteEmail="hola@vinculo.app"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos y Condiciones', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso de IA', href: '/aviso-ia' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
