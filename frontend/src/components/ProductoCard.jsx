// ProductoCard — tarjeta de un producto financiero del sistema regulado (CMF).
//
// Props (coinciden con el campo `productos_cmf[]` del BeneficiosJSON del backend):
//   nombre:          string — nombre del producto financiero
//   entidad:         string — institución financiera (banco, cooperativa, etc.)
//   monto_maximo_uf: number — monto máximo en UF
//   tasa_anual_pct:  number — tasa de interés anual referencial (ej: 6.5 para 6,5%)
//   plazo_max_meses: number — plazo máximo en meses
//   link:            string — URL oficial de la institución o del producto
//
// Animación: participa en el stagger de Resultado.jsx vía variants + whileHover propio.

import { motion } from 'framer-motion'

// Nombres de variante deben coincidir con los que usa el padre en Resultado.jsx
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function ProductoCard({ nombre, entidad, monto_maximo_uf, tasa_anual_pct, plazo_max_meses, link }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '16px',
        padding: '20px 24px',
      }}
    >
      {/* Header: entidad + nombre del producto */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '18px',
      }}>
        <div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            color: 'rgba(245,240,232,0.35)',
            margin: '0 0 3px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {entidad}
          </p>
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
            color: '#F5F0E8',
            margin: 0,
          }}>
            {nombre}
          </p>
        </div>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '18px' }}>🏦</span>
        </div>
      </div>

      {/* Stats: monto máx. | tasa anual | plazo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '14px',
      }}>
        {[
          { label: 'Monto máx.', valor: `${monto_maximo_uf} UF` },
          { label: 'Tasa anual', valor: `${tasa_anual_pct}%` },
          { label: 'Plazo', valor: `${plazo_max_meses} meses` },
        ].map(s => (
          <div key={s.label}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              color: 'rgba(245,240,232,0.3)',
              margin: '0 0 3px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {s.label}
            </p>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '14px',
              fontWeight: 700,
              color: '#F5F0E8',
              margin: 0,
            }}>
              {s.valor}
            </p>
          </div>
        ))}
      </div>

      {/* Disclaimer referencial */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '11px',
        color: 'rgba(245,240,232,0.22)',
        margin: '0 0 14px',
        lineHeight: 1.5,
      }}>
        Tasa referencial — verifica condiciones actuales con la institución.
      </p>

      {/* CTA al sitio oficial */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 500,
            color: '#FBBF24',
            textDecoration: 'none',
          }}
        >
          Ver en sitio oficial →
        </a>
      )}
    </motion.div>
  )
}
