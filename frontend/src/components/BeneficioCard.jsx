// BeneficioCard — tarjeta de beneficio tributario, financiero o subsidio.

import { motion } from 'framer-motion'

const C = {
  bg:      '#F8F4ED',
  bgCard:  '#EDEAE3',
  ink:     '#1A1A1A',
  inkMid:  '#4A4A48',
  inkSoft: '#76756F',
  line:    '#DCD8CF',
  accent:  '#0F3D2E',
}

const CONFIG_TIPO = {
  tributario: {
    label: 'Tributario',
    icon: '📊',
    iconBg: 'rgba(15,61,46,0.08)',
    badgeColor: '#0F3D2E',
    badgeBg: 'rgba(15,61,46,0.08)',
    accentColor: '#0F3D2E',
    leftBorder: '#0F3D2E',
  },
  financiero: {
    label: 'Financiero',
    icon: '🏦',
    iconBg: 'rgba(29,78,216,0.07)',
    badgeColor: '#1D4ED8',
    badgeBg: 'rgba(29,78,216,0.07)',
    accentColor: '#1D4ED8',
    leftBorder: '#3B82F6',
  },
  subsidio: {
    label: 'Subsidio Estado',
    icon: '🎯',
    iconBg: 'rgba(5,150,105,0.08)',
    badgeColor: '#065F46',
    badgeBg: 'rgba(5,150,105,0.08)',
    accentColor: '#059669',
    leftBorder: '#10B981',
  },
  comercial: {
    label: 'Comercial',
    icon: '🤝',
    iconBg: 'rgba(124,58,237,0.07)',
    badgeColor: '#5B21B6',
    badgeBg: 'rgba(124,58,237,0.07)',
    accentColor: '#7C3AED',
    leftBorder: '#8B5CF6',
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function BeneficioCard({ tipo, nombre, descripcion, monto_estimado }) {
  const cfg = CONFIG_TIPO[tipo] ?? CONFIG_TIPO.tributario
  const montoFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP', maximumFractionDigits: 0,
  }).format(monto_estimado)

  return (
    <motion.div
      variants={itemVariants}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${C.line}`,
        borderRadius: 20,
        padding: '24px 24px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        borderLeft: `4px solid ${cfg.leftBorder}`,
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Icono + badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: cfg.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>
          {cfg.icon}
        </div>
        <span style={{
          background: cfg.badgeBg, color: cfg.badgeColor,
          fontSize: 10, fontWeight: 700,
          padding: '4px 10px', borderRadius: 100,
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          {cfg.label}
        </span>
      </div>

      {/* Monto destacado */}
      <div style={{
        fontSize: 28, fontWeight: 800,
        color: cfg.accentColor,
        letterSpacing: '-0.02em', lineHeight: 1,
      }}>
        {montoFormateado}
      </div>

      {/* Nombre */}
      <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0, lineHeight: 1.35 }}>
        {nombre}
      </p>

      {/* Descripción */}
      <p style={{ fontSize: 13, color: C.inkSoft, margin: 0, lineHeight: 1.65, flexGrow: 1 }}>
        {descripcion}
      </p>
    </motion.div>
  )
}
