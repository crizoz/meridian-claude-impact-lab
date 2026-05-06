// BeneficioCard — tarjeta de un beneficio tributario, financiero o subsidio.
//
// Props (coinciden con el campo `beneficios[]` del BeneficiosJSON del backend):
//   tipo:           'tributario' | 'financiero' | 'subsidio'
//   nombre:         string — nombre del beneficio
//   descripcion:    string — explicación sin jerga legal
//   monto_estimado: number — monto en pesos chilenos (CLP)
//
// Animación: participa en el stagger de Resultado.jsx vía variants de Framer Motion.
// El padre debe usar initial="hidden" whileInView="show" con staggerChildren.

import { motion } from 'framer-motion'

const CONFIG_TIPO = {
  tributario: {
    icono: '📊',
    label: 'Tributario',
    bg: 'rgba(251,191,36,0.07)',
    border: 'rgba(251,191,36,0.18)',
    badgeBg: 'rgba(251,191,36,0.12)',
    color: '#FBBF24',
  },
  financiero: {
    icono: '🏦',
    label: 'Financiero',
    bg: 'rgba(96,165,250,0.06)',
    border: 'rgba(96,165,250,0.15)',
    badgeBg: 'rgba(96,165,250,0.10)',
    color: '#60A5FA',
  },
  subsidio: {
    icono: '🎯',
    label: 'Subsidio',
    bg: 'rgba(52,211,153,0.06)',
    border: 'rgba(52,211,153,0.15)',
    badgeBg: 'rgba(52,211,153,0.10)',
    color: '#34D399',
  },
}

// Nombres de variante deben coincidir con los que usa el padre en Resultado.jsx
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function BeneficioCard({ tipo, nombre, descripcion, monto_estimado }) {
  const cfg = CONFIG_TIPO[tipo] ?? CONFIG_TIPO.tributario
  const montoFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(monto_estimado)

  return (
    <motion.div
      variants={itemVariants}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: '16px',
        padding: '22px 24px',
      }}
    >
      {/* Header: badge de tipo + monto estimado */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{cfg.icono}</span>
          <span style={{
            background: cfg.badgeBg,
            color: cfg.color,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 500,
            padding: '3px 10px',
            borderRadius: '100px',
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}>
            {cfg.label}
          </span>
        </div>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '17px',
          fontWeight: 700,
          color: cfg.color,
          flexShrink: 0,
        }}>
          {montoFormateado}
        </span>
      </div>

      {/* Nombre del beneficio */}
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '16px',
        fontWeight: 700,
        color: '#F5F0E8',
        margin: '0 0 6px',
        lineHeight: 1.3,
      }}>
        {nombre}
      </p>

      {/* Descripción */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        color: 'rgba(245,240,232,0.55)',
        margin: 0,
        lineHeight: 1.65,
      }}>
        {descripcion}
      </p>
    </motion.div>
  )
}
