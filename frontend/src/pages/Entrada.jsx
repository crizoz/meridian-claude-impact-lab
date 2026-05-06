// frontend/src/pages/Entrada.jsx
// Meridian — Landing page · Diseño blanco, profesional y cálido

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, animate } from 'framer-motion'

// ─── Sistema de diseño ────────────────────────────────────────────────────────
const C = {
  bg:           '#FAFAF8',
  bgWhite:      '#FFFFFF',
  bgAmber:      '#FFFBEB',
  text:         '#18181B',
  textMid:      '#52525B',
  textMuted:    '#71717A',
  textFaint:    '#A1A1AA',
  amber:        '#F59E0B',
  amberDark:    '#D97706',
  amberBorder:  '#FCD34D',
  amberLight:   '#FEF3C7',
  border:       '#E4E4E7',
  borderMid:    '#D4D4D8',
}

const ease = [0.22, 1, 0.36, 1]

// ─── Número animado ───────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 2 }) {
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

// ─── Iconos SVG ───────────────────────────────────────────────────────────────
function IconCredit() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="7" width="22" height="14" rx="2.5" />
      <path d="M1 11h22" />
      <path d="M12 3L22 7H2L12 3Z" />
    </svg>
  )
}

function IconReceipt() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  )
}

function IconGrowth() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function MeridianLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '34px',
        height: '34px',
        borderRadius: '10px',
        background: '#18181B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '16px',
          fontWeight: 800,
          color: C.amber,
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}>M</span>
      </div>
      <div>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '17px',
          fontWeight: 700,
          color: C.text,
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>Meridian</p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '11px',
          fontWeight: 500,
          color: C.textFaint,
          margin: 0,
          lineHeight: 1,
          marginTop: '2px',
        }}>Asesor financiero IA</p>
      </div>
    </div>
  )
}

// ─── Stat item ────────────────────────────────────────────────────────────────
function StatItem({ numero, label, animated, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease }}
      style={{ textAlign: 'center', flex: 1 }}
    >
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(22px, 5vw, 28px)',
        fontWeight: 800,
        color: C.text,
        margin: '0 0 4px',
        letterSpacing: '-0.03em',
        lineHeight: 1,
      }}>
        {animated ? <AnimatedNumber target={numero} duration={1.8} /> : numero.toLocaleString('es-CL')}
      </p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '12px',
        fontWeight: 500,
        color: C.textMuted,
        margin: 0,
        lineHeight: 1.4,
      }}>{label}</p>
    </motion.div>
  )
}

// ─── Card de punto de dolor ───────────────────────────────────────────────────
function PainCard({ icon, titulo, descripcion, onClick, delay }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        width: '100%',
        background: C.bgWhite,
        border: `1.5px solid ${hovered ? C.amberBorder : C.border}`,
        borderRadius: '16px',
        padding: '22px 22px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        boxShadow: hovered
          ? '0 8px 24px rgba(245,158,11,0.10), 0 2px 6px rgba(0,0,0,0.05)'
          : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
      }}
    >
      {/* Icono */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: hovered ? C.amberLight : '#F4F4F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: hovered ? C.amberDark : C.textMuted,
        transition: 'background 0.2s, color 0.2s',
        marginTop: '2px',
      }}>
        {icon}
      </div>

      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '16px',
          fontWeight: 700,
          color: C.text,
          margin: '0 0 6px',
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}>{titulo}</p>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          color: C.textMuted,
          margin: '0 0 14px',
          lineHeight: 1.65,
        }}>{descripcion}</p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '13px',
          fontWeight: 600,
          color: hovered ? C.amberDark : C.textMid,
          transition: 'color 0.2s',
        }}>
          <span>Calcular mis beneficios</span>
          <motion.span
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <IconArrow />
          </motion.span>
        </div>
      </div>
    </motion.button>
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
      delay: 0.55,
    },
    {
      icon: <IconReceipt />,
      titulo: 'Me pidieron boleta',
      descripcion: 'Mercado Libre, un cliente grande o el municipio — el muro siempre es el mismo.',
      dolor: 'necesito_boleta',
      delay: 0.63,
    },
    {
      icon: <IconGrowth />,
      titulo: 'Quiero hacer crecer mi negocio',
      descripcion: 'Hay beneficios estatales, créditos Fogape y programas Corfo que aún no estás usando.',
      dolor: 'quiero_crecer',
      delay: 0.71,
    },
  ]

  const trustItems = ['5 minutos', 'Completamente gratis', 'Sin crear cuenta']

  return (
    <div style={{
      minHeight: '100svh',
      background: C.bg,
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0 24px 80px',
      }}>

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          style={{
            paddingTop: '32px',
            paddingBottom: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <MeridianLogo />
        </motion.header>

        {/* ── Hero ── */}
        <section style={{ marginBottom: '52px' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4, ease }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: C.amberLight,
              border: `1px solid ${C.amberBorder}`,
              borderRadius: '100px',
              padding: '6px 14px',
              marginBottom: '24px',
            }}
          >
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: C.amber,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              color: C.amberDark,
              letterSpacing: '0.01em',
            }}>
              Chile · Microemprendedores
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5, ease }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(36px, 9vw, 52px)',
              fontWeight: 800,
              color: C.text,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              margin: '0 0 20px',
            }}
          >
            Descubre lo que<br />
            <span style={{ color: C.amberDark }}>tu negocio merece</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45, ease }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '17px',
              color: C.textMid,
              lineHeight: 1.7,
              margin: '0 0 36px',
              maxWidth: '480px',
            }}
          >
            En Chile, más de 1.800.000 microemprendedores no conocen los
            beneficios del Estado que les corresponden. En 5 minutos calculamos
            cuánto dinero está esperándote — en números reales.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.4 }}
            style={{
              display: 'flex',
              gap: '0',
              background: C.bgWhite,
              border: `1px solid ${C.border}`,
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            {[
              { numero: stats.total_perfiles, label: 'Perfiles\ncalculados', animated: true },
              { numero: stats.total_planes_enviados, label: 'Planes\nenviados', animated: true },
              { numero: 15, label: 'Regiones\nen Chile', animated: false },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1,
                padding: '18px 12px',
                borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
                textAlign: 'center',
              }}>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(20px, 5vw, 26px)',
                  fontWeight: 800,
                  color: C.text,
                  margin: '0 0 4px',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}>
                  {s.animated
                    ? <AnimatedNumber target={s.numero} duration={1.6} />
                    : s.numero.toLocaleString('es-CL')
                  }
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                  color: C.textMuted,
                  margin: 0,
                  lineHeight: 1.35,
                  whiteSpace: 'pre-line',
                }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Separador ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42, duration: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: C.border }} />
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: C.textFaint,
            margin: 0,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            ¿Cuál es tu situación hoy?
          </p>
          <div style={{ flex: 1, height: '1px', background: C.border }} />
        </motion.div>

        {/* ── Cards de dolor ── */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '32px',
        }}>
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
        </section>

        {/* ── Trust strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px 20px',
            marginBottom: '48px',
          }}
        >
          {trustItems.map(item => (
            <div key={item} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: C.amberLight,
                border: `1px solid ${C.amberBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.amberDark,
                flexShrink: 0,
              }}>
                <IconCheck />
              </div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 500,
                color: C.textMid,
              }}>{item}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Footer ── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.4 }}
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: C.textFaint,
            margin: 0,
          }}>
            Meridian no almacena datos personales sin tu consentimiento.
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: C.textFaint,
            margin: 0,
          }}>
            Claude Impact Lab Chile 2026
          </p>
        </motion.footer>

      </div>
    </div>
  )
}
