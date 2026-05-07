// PlanAccion — pasos concretos con progreso y checkboxes persistidos.

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const C = {
  bg:      '#F8F4ED',
  bgCard:  '#EDEAE3',
  ink:     '#1A1A1A',
  inkMid:  '#4A4A48',
  inkSoft: '#76756F',
  line:    '#DCD8CF',
  lineSoft:'#E8E5DC',
  accent:  '#0F3D2E',
}

const STORAGE_KEY = 'meridian_plan_completado'

const URGENCIA_CFG = {
  alta:  { label: 'Urgente', color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  media: { label: 'Esta semana', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  baja:  { label: 'Este mes', color: '#76756F', bg: 'rgba(118,117,111,0.08)' },
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
}

export default function PlanAccion({ pasos }) {
  const [completados, setCompletados] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completados))
  }, [completados])

  const toggle = (paso) =>
    setCompletados(prev =>
      prev.includes(paso) ? prev.filter(p => p !== paso) : [...prev, paso]
    )

  const progreso = pasos.length > 0 ? completados.length / pasos.length : 0

  return (
    <div>
      {/* Header con barra de progreso */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: C.accent, margin: 0,
          }}>
            Tu plan de acción
          </p>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.inkSoft }}>
            {completados.length} / {pasos.length} completados
          </span>
        </div>
        <div style={{ height: 5, background: C.lineSoft, borderRadius: 100, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${progreso * 100}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', background: C.accent, borderRadius: 100 }}
          />
        </div>
        {completados.length === pasos.length && pasos.length > 0 && (
          <p style={{ fontSize: 12, color: C.accent, fontWeight: 600, margin: '8px 0 0', textAlign: 'center' }}>
            ¡Completaste todos los pasos! 🎉
          </p>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {pasos.map((p) => {
          const hecho = completados.includes(p.paso)
          const urg = URGENCIA_CFG[p.urgencia] ?? URGENCIA_CFG.media

          return (
            <motion.div
              key={p.paso}
              variants={itemVariants}
              style={{
                background: hecho ? 'rgba(15,61,46,0.04)' : '#FFFFFF',
                border: `1.5px solid ${hecho ? 'rgba(15,61,46,0.18)' : C.line}`,
                borderRadius: 16,
                padding: '16px 18px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Número circular / check */}
              <button
                onClick={() => toggle(p.paso)}
                aria-label={hecho ? 'Marcar pendiente' : 'Marcar completado'}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: 'none',
                  background: hecho ? C.accent : C.bgCard,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.22s',
                  padding: 0,
                }}
              >
                {hecho ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, fontWeight: 700,
                    color: C.inkMid, lineHeight: 1,
                  }}>
                    {String(p.paso).padStart(2, '0')}
                  </span>
                )}
              </button>

              {/* Contenido */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 14, fontWeight: 600,
                  color: hecho ? C.inkSoft : C.ink,
                  margin: '0 0 8px', lineHeight: 1.45,
                  textDecoration: hecho ? 'line-through' : 'none',
                  transition: 'color 0.2s',
                }}>
                  {p.descripcion}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    background: urg.bg, color: urg.color,
                    fontSize: 10, fontWeight: 700,
                    padding: '3px 9px', borderRadius: 100,
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>
                    {p.tiempo_estimado || urg.label}
                  </span>
                  {p.link_recurso && !hecho && (
                    <a
                      href={p.link_recurso}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12, fontWeight: 600,
                        color: C.accent, textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      Ir al sitio →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
