// BeneficioCard — Tarjeta de un beneficio tributario o financiero detectado
//
// Renderiza ícono, nombre del beneficio, descripción en lenguaje simple,
// monto estimado de ahorro/crédito y el primer paso concreto a seguir.
//
// Props:
//   tipo:            "tributario" | "financiero" | "capacitacion"
//   titulo:          string — nombre del beneficio
//   descripcion:     string — explicación sin jerga legal
//   monto_estimado:  number — monto en pesos chilenos
//   primer_paso:     string — acción concreta a tomar hoy
//
// Animación: fade in + slide up con Framer Motion al montar (motion.div)
// Usar formatear monto con Intl.NumberFormat para separadores de miles chilenos

export default function BeneficioCard({ tipo, titulo, descripcion, monto_estimado, primer_paso }) {
  // TODO: mapear tipo → ícono (ej: "tributario" → ícono de calculadora)
  // TODO: formatear monto_estimado con Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })

  return (
    <div>
      {/* TODO: ícono según tipo */}
      {/* TODO: título */}
      {/* TODO: descripción */}
      {/* TODO: monto estimado formateado */}
      {/* TODO: primer_paso como CTA destacado */}
    </div>
  )
}
