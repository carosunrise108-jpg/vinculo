import type { Metadata } from "next";
import { Instrument_Serif, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// FICHA-ARTE v2 (2026-09-29) — rebrand completo pedido por la usuaria con paquete de
// diseño propio. Instrument Serif (títulos, itálica = voz íntima) + Hanken Grotesk
// (interfaz) reemplazan Fredoka/Nunito.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Vínculo — Primero tú. Luego, nosotros.",
  description:
    "Vínculo: meditación y prácticas guiadas para transformar la soledad en conexión.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${instrumentSerif.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
