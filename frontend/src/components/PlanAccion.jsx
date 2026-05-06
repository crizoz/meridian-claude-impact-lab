// PlanAccion — lista de pasos concretos ordenados por urgencia.
//
// Props (coinciden con el campo `plan_accion[]` del BeneficiosJSON del backend):
//   pasos: {
//     paso:            number
//     descripcion:     string — acción concreta a tomar
//     tiempo_estimado: string — "Esta semana" | "Este mes" | etc.
//     urgencia:        'alta' | 'media' | 'baja'
//     link_recurso:    string | null — URL al recurso si aplica
//   }[]
//
// Los checkboxes se persisten en localStorage para sobrevivir al cerrar el navegador.
// Animación: entrada escalonada con staggerChildren de Framer Motion.

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'meridian_plan_completado'

const URGENCIA_CFG = {
  alta:  { dot: '#FBBF24' },
  media: { dot: '#60A5FA' },
  baja:  { dot: 'rgba(245,240,232,0.3)' },
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function PlanAccion({ pasos }) {
  const [completados, setCompletados] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completados))
  }, [completados])

  const toggle = (paso) =>
    setCompletados(prev =>
      prev.includes(paso) ? prev.filter(p => p !== paso) : [...prev, paso]
    )

  return (
    <div>
      {/* Header de sección — mismo estilo que los otros en Resultado.jsx */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px',
        fontWeight: 500,
        color: 'rgba(245,240,232,0.35)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        margin: '0 0 16px',
      }}>
        Tu plan de acción
      </p>

      <motion.ul
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {pasos.map((p) => {
          const hecho = completados.includes(p.paso)
          const urgencia = URGENCIA_CFG[p.urgencia] ?? URGENCIA_CFG.media

          return (
            <motion.li
              key={p.paso}
              variants={itemVariants}
              style={{
                background: hecho ? 'rgba(52,211,153,0.05)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${hecho ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              {/* Checkbox interactivo */}
              <button
                onClick={() => toggle(p.paso)}
                aria-label={hecho ? 'Marcar como pendiente' : 'Marcar como completado'}
                style={{
                  width: '22px', height: '22px',
                  borderRadius: '6px',
                  border: `2px solid ${hecho ? '#34D399' : 'rgba(255,255,255,0.15)'}`,
                  background: hecho ? 'rgba(52,211,153,0.15)' : 'transparent',
                  flexShrink: 0,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  marginTop: '1px',
                  padding: 0,
                }}
              >
                {hecho && (
                  <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 700, lineHeight: 1 }}>✓</span>
                )}
              </button>

              {/* Contenido del paso */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  color: hecho ? 'rgba(245,240,232,0.35)' : '#F5F0E8',
                  margin: '0 0 8px',
                  lineHeight: 1.5,
                  textDecoration: hecho ? 'line-through' : 'none',
                  transition: 'color 0.2s',
                }}>
                  {p.descripcion}
                </p>

                {/* Metadata: timing + link */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{
                      width: '6px', height: '6px',
                      borderRadius: '50%',
                      background: urgencia.dot,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '12px',
                      color: 'rgba(245,240,232,0.35)',
                    }}>
                      {p.tiempo_estimado}
                    </span>
                  </div>
                  {p.link_recurso && (
                    <a
                      href={p.link_recurso}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '12px',
                        color: '#FBBF24',
                        textDecoration: 'none',
                      }}
                    >
                      Ir al sitio →
                    </a>
                  )}
                </div>
              </div>
            </motion.li>
          )
        })}
      </motion.ul>
    </div>
  )
}
