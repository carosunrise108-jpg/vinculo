'use client';

// Página de ventas de Vínculo — compuesta desde el KIT CANÓNICO (plantillas-codigo/landing/
// → components/landing/), en el orden de la ESTRUCTURA CANÓNICA de 19-PAGINA-DE-VENTAS.md.
// Copy MARCADO trazado a FICHA-AVATAR.md — fuente completa en docs/copy/landing.md.
// Tokens tematizados desde FICHA-ARTE.md v2 (rebrand 2026-09-29) en components/landing/tokens.css.
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
const CTA_LABEL = 'Comenzar mi test';

export default function LandingVinculo() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* 1. HERO */}
      <Hero
        appName="Vínculo"
        loginHref="/entrar"
        h1Marked="Primero tú. [acento]Luego, nosotros.[/acento]"
        subtitleMarked="Meditación y prácticas guiadas para volver a ti, y desde ahí, [b]a los demás[/b]"
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>De la creadora de Mujer Divina — más de 100 mujeres acompañadas en 5 años</span>}
        visualPlaceholderSugerencia="captura de tu Mapa de conexión ya generado"
        visual={
          // Captura REAL de la pantalla de resultado ya diseñada (App-Mapa.dc.html del
          // paquete de la usuaria) — mockup honesto nivel 2 (19 §5), no recreado.
          <img
            src="/mockups/mapa.png"
            alt="Tu Mapa de conexión, con tus 5 vínculos"
            width={390}
            height={844}
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
        mecanismo="tu Mapa de conexión"
        bigIdeaMarked="No te falta fuerza de voluntad — te faltaba ver [b]dónde está tu vínculo más débil[/b]. Tu Mapa lo muestra, y tu Camino te lleva ahí, paso a paso."
        pasos={[
          { titulo: 'Respondes un test breve', detalle: '12 preguntas sobre cómo te vinculas hoy.' },
          { titulo: 'Ves tu Mapa', detalle: 'Contigo, familia, amistad, comunidad y propósito — de un vistazo.' },
          { titulo: 'Empiezas tu Camino', detalle: 'Una práctica diaria, etapa por etapa.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Otra app, otro intento que se apaga a los tres mensajes.',
          labelDespues: 'Después',
          despues: 'Tu propio Mapa y una práctica diaria que te lleva a tu gente.',
        }}
      />

      {/* 5. LA APP POR DENTRO — capturas REALES de las pantallas ya diseñadas por la
          usuaria (App-Bienvenida/App-Mapa/App-Camino .dc.html) — mockup honesto nivel 2
          (19 §5), no recreado. El resto de pantallas (Test, Hoy, Práctica) se agregan
          cuando se rendericen en código (próximas capas del rebrand, ver ESTADO.md). */}
      <AppPorDentro
        tituloMarked="Tu proceso, [acento]paso a paso[/acento]"
        frames={[
          { src: '/mockups/bienvenida.png', alt: 'Pantalla de bienvenida', label: 'Así empiezas' },
          { src: '/mockups/mapa.png', alt: 'Tu Mapa de conexión', label: 'Tu Mapa de conexión' },
          { src: '/mockups/camino.png', alt: 'Tu Camino, etapa por etapa', label: 'Tu Camino, etapa por etapa' },
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
            { resultado: 'Tu Mapa de conexión completo (12 meses)', valor: '$96' },
            { resultado: 'Prácticas guiadas nuevas cada semana', valor: '$40' },
            { resultado: 'Tu Plan de regreso si te alejas, sin culpa', valor: '$24' },
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
            'Prácticas guiadas nuevas cada semana',
            'Plan de regreso si te alejas, sin culpa',
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
            'Prácticas guiadas nuevas cada semana',
            'Plan de regreso si te alejas, sin culpa',
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
              'No: no hay chatbot que finja ser tu amiga. Tu Mapa te muestra [b]tus propios vínculos[/b] — la meta es que necesites la app cada vez menos.',
          },
          {
            pregunta: 'Ya probé apps así y las abandono. ¿Por qué esta sería distinta?',
            respuestaMarked:
              'Las otras te dejan sola justo después del match. Vínculo es el después: una práctica diaria que te dice [b]qué hacer distinto[/b] para tu semana real.',
          },
          {
            pregunta: 'No tengo tiempo ni ganas de otra app que me pida "ser social" como tarea.',
            respuestaMarked: 'No te manda a socializar. Empieza contigo, con prácticas de minutos, no de horas.',
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
        h2Marked="Primero [acento]tú[/acento]"
        futurePacingMarked="Un domingo cualquiera, sabes exactamente qué práctica te toca — y ya no se siente hueco."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="Garantía del Primer Mapa · 7 días gratis"
        psMarked="PS: Vínculo te muestra tu Mapa de conexión y te acompaña con un Camino de prácticas guiadas, etapa por etapa. Hoy entras gratis por 7 días, con la Garantía del Primer Mapa."
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
