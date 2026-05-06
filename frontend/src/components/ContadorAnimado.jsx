// ContadorAnimado — número que cuenta de 0 al valor final al entrar en viewport.
//
// Props:
//   valor:       number — valor final
//   prefijo:     string — texto antes del número (ej: "$")   [default: ""]
//   sufijo:      string — texto después del número            [default: ""]
//   duracion_ms: number — duración de la animación en ms      [default: 2000]
//
// Usa Intersection Observer vía useInView de Framer Motion para iniciar
// la animación solo cuando el elemento es visible en el viewport.

import { useRef, useState, useEffect } from 'react'
import { useMotionValue, animate, useInView } from 'framer-motion'

export default function ContadorAnimado({ valor, prefijo = '', sufijo = '', duracion_ms = 2000 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(
    `${prefijo}${new Intl.NumberFormat('es-CL').format(0)}${sufijo}`
  )

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, valor, {
      duration: duracion_ms / 1000,
      ease: 'easeOut',
      onUpdate: v =>
        setDisplay(
          `${prefijo}${new Intl.NumberFormat('es-CL').format(Math.floor(v))}${sufijo}`
        ),
    })
    return controls.stop
  }, [inView, valor])

  return <span ref={ref}>{display}</span>
}
