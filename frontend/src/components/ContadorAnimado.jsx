// ContadorAnimado — Número que cuenta de 0 al valor final al entrar en viewport
//
// Ideal para mostrar el total de beneficios detectados o las stats de impacto.
// Usa Intersection Observer para iniciar la animación solo cuando es visible.
//
// Props:
//   valor:       number — valor final al que llegar
//   prefijo:     string — texto antes del número (ej: "$" o "UF ")   [default: ""]
//   sufijo:      string — texto después del número (ej: " MM" o " empresas")  [default: ""]
//   duracion_ms: number — duración de la animación en ms  [default: 2000]
//
// Implementación sugerida: useMotionValue + useSpring de Framer Motion,
// o requestAnimationFrame con easing cuadrático propio.
// Formatear el número con Intl.NumberFormat('es-CL') para separadores chilenos.

import { useRef } from 'react'

export default function ContadorAnimado({ valor, prefijo = '', sufijo = '', duracion_ms = 2000 }) {
  const ref = useRef(null)

  // TODO: useInView de Framer Motion para detectar cuando entra al viewport
  // TODO: useMotionValue(0) + useSpring hacia valor cuando inView === true
  // TODO: useEffect para subscribirse al motionValue y actualizar el texto
  // TODO: formatear con Intl.NumberFormat('es-CL') en cada frame

  return (
    <span ref={ref}>
      {/* TODO: renderizar prefijo + número animado + sufijo */}
    </span>
  )
}
