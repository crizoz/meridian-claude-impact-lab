// ProductoCard — producto financiero del sistema regulado (CMF).

import { motion } from 'framer-motion'

const C = {
  bg:      '#F8F4ED',
  bgCard:  '#EDEAE3',
  ink:     '#1A1A1A',
  inkMid:  '#4A4A48',
  inkSoft: '#76756F',
  inkFaint:'#A8A6A0',
  line:    '#DCD8CF',
  accent:  '#0F3D2E',
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function ProductoCard({ nombre, entidad, monto_maximo_uf, tasa_anual_pct, plazo_max_meses, link }) {
  return (
    <motion.div
      variants={itemVariants}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${C.line}`,
        borderRadius: 16,
        padding: '18px 20px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <p style={{
            fontSize: 10, color: C.inkSoft, margin: '0 0 3px',
            textTransform: 'uppercase', letterSpacing: '0.10em', fontWeight: 700,
          }}>
            {entidad}
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>
            {nombre}
          </p>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(15,61,46,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>
          🏦
        </div>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8, marginBottom: 14,
        background: C.bg, borderRadius: 10, padding: '12px 14px',
      }}>
        {[
          { label: 'Monto máx.', valor: `${monto_maximo_uf} UF` },
          { label: 'Tasa anual', valor: `${tasa_anual_pct}%` },
          { label: 'Plazo', valor: plazo_max_meses ? `${plazo_max_meses} meses` : 'Consultar' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: 9.5, color: C.inkFaint, margin: '0 0 3px',
              textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
            }}>
              {s.label}
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>
              {s.valor}
            </p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: C.inkFaint, margin: '0 0 12px', lineHeight: 1.4 }}>
        Tasa referencial — verifica condiciones con la institución.
      </p>

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 13, fontWeight: 600, color: C.accent,
            textDecoration: 'none',
          }}
        >
          Ver en sitio oficial →
        </a>
      )}
    </motion.div>
  )
}
