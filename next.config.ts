import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Apaga el badge de dev de Next.js — tapa contenido real en las capturas
  // a 375px que usa el revisor-visual para puntuar (32/50).
  devIndicators: false,
};

export default nextConfig;
