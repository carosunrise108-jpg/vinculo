// Símbolo de marca — dos círculos (uno sólido = tú, uno punteado = el otro). Es el
// dispositivo ownable de FICHA-ARTE v2, del paquete de diseño de la usuaria. Se usa
// como SVG inline (no <img>) para poder cambiar el color con currentColor/props y
// quedar nítido a cualquier tamaño.

export function VinculoSimbolo({
  size = 24,
  color = 'currentColor',
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  const width = size * 1.5;
  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 120 80"
      aria-hidden="true"
      className={className}
    >
      <circle cx="45" cy="40" r="30" fill="none" stroke={color} strokeWidth="3" />
      <circle cx="75" cy="40" r="30" fill="none" stroke={color} strokeWidth="3" strokeDasharray="6 7" />
      <circle cx="45" cy="40" r="6" fill={color} />
    </svg>
  );
}
