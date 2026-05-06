// frontend/src/pages/Entrada.jsx
// Meridian — Landing page · Diseño cálido y acogedor
// Fuentes en index.html:
// <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, animate } from 'framer-motion'

// ─── Paleta Meridian ──────────────────────────────────────────────────────────
const C = {
  bg:           '#0E0C09',
  accent:       '#F5A623',
  accentMid:    'rgba(245,166,35,0.65)',
  accentDim:    'rgba(245,166,35,0.09)',
  accentBorder: 'rgba(245,166,35,0.16)',
  accentHover:  'rgba(245,166,35,0.07)',
  text:         '#F8F3EB',
  textMid:      'rgba(248,243,235,0.54)',
  textFaint:    'rgba(248,243,235,0.28)',
  cardBg:       'rgba(255,248,230,0.034)',
  cardHoverBg:  'rgba(245,166,35,0.065)',
  cardBorder:   'rgba(245,166,35,0.13)',
  cardHoverBorder: 'rgba(245,166,35,0.30)',
}

// ─── Número animado ───────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 2.2 }) {
  const count = useMotionValue(0)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    const controls = animate(count, target, {
      duration,
      ease: 'easeOut',
      onUpdate: v => setDisplay(Math.floor(v).toLocaleString('es-CL')),
    })
    return controls.stop
  }, [target])

  return <span>{display}</span>
}

// ─── Iconos SVG (sin emoji) ───────────────────────────────────────────────────
function IconCredit() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="7" width="22" height="14" rx="2.5" />
      <path d="M1 11h22" />
      <path d="M12 3L22 7H2L12 3Z" />
    </svg>
  )
}

function IconReceipt() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  )
}

function IconGrowth() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

// ─── Logo Meridian ────────────────────────────────────────────────────────────
function MeridianLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '10px',
        background: 'linear-gradient(145deg, #F5A623 0%, #FBBF24 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 18px rgba(245,166,35,0.30)',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '15px',
          fontWeight: 800,
          color: '#0E0C09',
          letterSpacing: '-0.05em',
          lineHeight: 1,
        }}>
          M
        </span>
      </div>
      <div>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '17px',
          fontWeight: 700,
          color: C.text,
          letterSpacing: '-0.025em',
          display: 'block',
          lineHeight: 1.1,
        }}>
          Meridian
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '11px',
          color: C.textFaint,
          letterSpacing: '0.02em',
          display: 'block',
          lineHeight: 1,
          marginTop: '2px',
        }}>
          Asesor financiero IA
        </span>
      </div>
    </div>
  )
}

// ─── Card de punto de dolor ───────────────────────────────────────────────────
function PainCard({ icon, titulo, descripcion, onClick, delay }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered ? C.cardHoverBg : C.cardBg,
        border: `1px solid ${hovered ? C.cardHoverBorder : C.cardBorder}`,
        borderRadius: '20px',
        padding: '22px 22px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        transition: 'background 0.22s, border-color 0.22s, transform 0.22s, box-shadow 0.22s',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      {/* Contenedor del icono */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '13px',
        background: hovered ? 'rgba(245,166,35,0.15)' : 'rgba(245,166,35,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '14px',
        color: C.accent,
        transition: 'background 0.22s',
      }}>
        {icon}
      </div>

      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '16px',
        fontWeight: 700,
        color: C.text,
        margin: '0 0 7px',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      }}>
        {titulo}
      </p>

      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        color: C.textMid,
        margin: '0 0 16px',
        lineHeight: 1.7,
      }}>
        {descripcion}
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        color: hovered ? C.accent : C.accentMid,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px',
        fontWeight: 600,
        transition: 'color 0.2s',
      }}>
        <span>Calcular mis beneficios</span>
        <motion.span
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ display: 'inline-block' }}
        >
          →
        </motion.span>
      </div>
    </motion.button>
  )
}

// ─── Chip de estadística ──────────────────────────────────────────────────────
function StatChip({ valor, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: C.accentDim,
        border: `1px solid ${C.accentBorder}`,
        borderRadius: '100px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '14px',
        fontWeight: 700,
        color: C.accent,
      }}>
        {valor}
      </span>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px',
        color: C.textMid,
      }}>
        {label}
      </span>
    </motion.div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Entrada() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total_perfiles: 0, total_planes_enviados: 0 })

  useEffect(() => {
    // TODO: fetch real desde /api/stats cuando el backend esté listo
    setStats({ total_perfiles: 124, total_planes_enviados: 87 })
  }, [])

  const handlePain = (dolor) => {
    sessionStorage.setItem('meridian_dolor', dolor)
    navigate('/preguntas')
  }

  const pains = [
    {
      icon: <IconCredit />,
      titulo: 'Me rechazaron un crédito',
      descripcion: 'Sin RUT tributario activo, ningún banco puede evaluarte aunque tu negocio funcione bien.',
      dolor: 'credito_rechazado',
      delay: 0.62,
    },
    {
      icon: <IconReceipt />,
      titulo: 'Me pidieron boleta',
      descripcion: 'Mercado Libre, un cliente grande o el municipio — el muro siempre es el mismo.',
      dolor: 'necesito_boleta',
      delay: 0.72,
    },
    {
      icon: <IconGrowth />,
      titulo: 'Quiero hacer crecer mi negocio',
      descripcion: 'Hay beneficios estatales, créditos Fogape y programas Corfo que no estás usando.',
      dolor: 'quiero_crecer',
      delay: 0.82,
    },
  ]

  return (
    <div style={{
      minHeight: '100svh',
      background: C.bg,
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Fondos ambientales cálidos en capas */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: [
          'radial-gradient(ellipse 95% 65% at 8% -25%, rgba(245,130,15,0.20) 0%, transparent 58%)',
          'radial-gradient(ellipse 65% 45% at 92% 110%, rgba(190,100,10,0.11) 0%, transparent 52%)',
        ].join(', '),
        pointerEvents: 'none',
      }} />

      {/* Línea vertical decorativa */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '18%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(245,166,35,0.13), transparent 52%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '560px',
        margin: '0 auto',
        padding: '0 24px 96px',
        position: 'relative',
      }}>

        {/* Header: logo */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ paddingTop: '44px', paddingBottom: '52px' }}
        >
          <MeridianLogo />
        </motion.div>

        {/* Saludo humano — primera línea de contacto */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '15px',
            color: C.textMid,
            margin: '0 0 22px',
            lineHeight: 1.7,
            maxWidth: '400px',
          }}
        >
          Hola. En 5 minutos calculamos qué beneficios y créditos del Estado te corresponden — en números reales.
        </motion.p>

        {/* Hero: el número grande */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '12px' }}
        >
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(52px, 13vw, 82px)',
            fontWeight: 800,
            color: C.text,
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}>
            <AnimatedNumber target={1800000} duration={2.2} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.30, duration: 0.5 }}
          style={{ marginBottom: '44px' }}
        >
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(18px, 4.5vw, 23px)',
            fontWeight: 700,
            color: C.accent,
            margin: '0 0 14px',
            lineHeight: 1.25,
            letterSpacing: '-0.015em',
          }}>
            microemprendedores en Chile
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '15px',
            color: C.textMid,
            margin: 0,
            lineHeight: 1.75,
            maxWidth: '390px',
          }}>
            Sin acceso a crédito. Sin beneficios del Estado. No porque no lo merezcan —
            sino porque nadie les mostró en números qué ganarían al formalizarse.
          </p>
        </motion.div>

        {/* Estadísticas en tiempo real */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44, duration: 0.5 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '52px',
          }}
        >
          <StatChip
            valor={stats.total_perfiles.toLocaleString('es-CL')}
            label="perfiles calculados"
            delay={0.44}
          />
          <StatChip
            valor={stats.total_planes_enviados.toLocaleString('es-CL')}
            label="planes enviados"
            delay={0.50}
          />
          <StatChip valor="15" label="regiones" delay={0.56} />
        </motion.div>

        {/* Etiqueta de selección */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.56, duration: 0.4 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: C.textFaint,
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            margin: '0 0 14px',
          }}
        >
          ¿Cuál es tu situación hoy?
        </motion.p>

        {/* Cards de puntos de dolor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pains.map(p => (
            <PainCard
              key={p.dolor}
              icon={p.icon}
              titulo={p.titulo}
              descripcion={p.descripcion}
              onClick={() => handlePain(p.dolor)}
              delay={p.delay}
            />
          ))}
        </div>

        {/* Indicador de fricción cero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
            marginTop: '28px',
          }}
        >
          {['5 minutos', 'Gratis', 'Sin registro'].map((item, i) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                color: C.textFaint,
              }}>
                {item}
              </span>
              {i < 2 && (
                <div style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: C.textFaint,
                  margin: '0 14px',
                }} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 0.5 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            color: 'rgba(248,243,235,0.18)',
            textAlign: 'center',
            marginTop: '44px',
            lineHeight: 1.7,
          }}
        >
          Meridian no almacena datos personales sin tu consentimiento.
          <br />
          Construido en Claude Impact Lab Chile 2026.
        </motion.p>

      </div>
    </div>
  )
}
