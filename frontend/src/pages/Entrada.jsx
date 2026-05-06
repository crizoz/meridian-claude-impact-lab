// frontend/src/pages/Entrada.jsx
// Meridian — Landing page · Diseño de referencia: crema + verde forestal

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, animate } from 'framer-motion'

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg:         '#F2EAE0',   // crema cálido — fondo signature
  bgCard:     '#FFFFFF',   // blanco para cards
  bgCardSel:  '#F0F7F2',   // verde muy tenue al seleccionar
  green:      '#1B3224',   // verde forestal oscuro — color primario
  greenMid:   '#2D5040',   // verde medio para texto secundario
  greenLight: 'rgba(27,50,36,0.07)',
  textGray:   '#78716C',   // stone-500 — cuerpo
  textLight:  '#A8A29E',   // stone-400 — captions
  border:     '#E2D9CE',   // crema con borde
  borderSel:  '#1B3224',   // borde al seleccionar
  shadow:     '0 1px 4px rgba(27,50,36,0.07), 0 2px 8px rgba(27,50,36,0.05)',
  shadowHov:  '0 4px 16px rgba(27,50,36,0.12)',
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
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  )
}

function IconTax() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconGrowth() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function MeridianLogo({ size = 32 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img
        src="/meridian-logo.svg"
        alt="Meridian"
        width={size}
        height={size}
        style={{ objectFit: 'contain', flexShrink: 0 }}
      />
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '17px',
        fontWeight: 800,
        color: C.green,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        Meridian
      </span>
    </div>
  )
}

// ─── Card de dolor (seleccionable) ────────────────────────────────────────────
function PainCard({ icon, titulo, descripcion, selected, onSelect, delay }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.42, ease }}
      whileTap={{ scale: 0.985 }}
      onClick={onSelect}
      style={{
        width: '100%',
        background: selected ? C.bgCardSel : C.bgCard,
        border: `1.5px solid ${selected ? C.borderSel : C.border}`,
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'left',
        cursor: 'pointer',
        boxShadow: selected ? C.shadowHov : C.shadow,
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
      }}
    >
      {/* Contenedor icono */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: selected ? 'rgba(27,50,36,0.10)' : '#F4F4F5',
        border: `1px solid ${selected ? 'rgba(27,50,36,0.18)' : '#E4E4E7'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: selected ? C.green : '#71717A',
        transition: 'all 0.2s',
      }}>
        {icon}
      </div>

      {/* Texto */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '16px',
          fontWeight: 700,
          color: C.green,
          margin: '0 0 6px',
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}>
          {titulo}
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          color: C.textGray,
          margin: 0,
          lineHeight: 1.65,
        }}>
          {descripcion}
        </p>
      </div>

      {/* Indicador de selección */}
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: `2px solid ${selected ? C.green : '#D4D4D8'}`,
        background: selected ? C.green : 'transparent',
        flexShrink: 0,
        marginTop: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.18s',
      }}>
        {selected && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </motion.button>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Entrada() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState({ total_perfiles: 0, total_planes_enviados: 0 })

  useEffect(() => {
    // TODO: fetch real desde /api/stats
    setStats({ total_perfiles: 14592, total_planes_enviados: 87 })
  }, [])

  const handleStart = () => {
    const dolor = selected || 'quiero_crecer'
    sessionStorage.setItem('meridian_dolor', dolor)
    navigate('/preguntas')
  }

  const pains = [
    {
      icon: <IconCredit />,
      titulo: 'No puedo pedir créditos',
      descripcion: 'Sin historial formal, el sistema tradicional te cierra las puertas. Descubre cómo construir tu reputación.',
      dolor: 'credito_rechazado',
      delay: 0.38,
    },
    {
      icon: <IconTax />,
      titulo: 'Impuestos me asustan',
      descripcion: 'El laberinto fiscal es intimidante. Simplificamos tus obligaciones para que operes con tranquilidad.',
      dolor: 'necesito_boleta',
      delay: 0.46,
    },
    {
      icon: <IconGrowth />,
      titulo: 'Quiero crecer',
      descripcion: 'Tienes el talento, te faltan las herramientas. Formaliza tu negocio y accede a nuevos mercados.',
      dolor: 'quiero_crecer',
      delay: 0.54,
    },
  ]

  return (
    <div style={{ minHeight: '100svh', background: C.bg }}>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <MeridianLogo size={28} />

        {/* Indicador IA */}
        <div style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: '100px',
          padding: '5px 12px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '11px',
          fontWeight: 600,
          color: C.greenMid,
          letterSpacing: '0.05em',
        }}>
          IA · Gratis
        </div>
      </motion.nav>

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0 24px 80px',
      }}>

        {/* ── Hero: número grande centrado ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5, ease }}
          style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '48px' }}
        >
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(58px, 16vw, 88px)',
            fontWeight: 800,
            color: C.green,
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}>
            <AnimatedNumber target={2000000} duration={2} />
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            color: C.textGray,
            margin: '14px auto 0',
            maxWidth: '260px',
            lineHeight: 1.6,
          }}>
            más de la mitad trabaja en la informalidad.
          </p>
        </motion.section>

        {/* ── Cards de dolor ── */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '28px',
        }}>
          {pains.map(p => (
            <PainCard
              key={p.dolor}
              icon={p.icon}
              titulo={p.titulo}
              descripcion={p.descripcion}
              selected={selected === p.dolor}
              onSelect={() => setSelected(selected === p.dolor ? null : p.dolor)}
              delay={p.delay}
            />
          ))}
        </section>

        {/* ── CTA principal ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4, ease }}
          style={{ marginBottom: '32px' }}
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            style={{
              width: '100%',
              background: C.green,
              border: 'none',
              borderRadius: '100px',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(27,50,36,0.25)',
              transition: 'box-shadow 0.2s',
            }}
          >
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}>
              Iniciar mi camino
            </span>
            <span style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center' }}>
              <IconArrow />
            </span>
          </motion.button>

          {!selected && (
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              color: C.textLight,
              textAlign: 'center',
              margin: '10px 0 0',
            }}>
              Selecciona tu situación o empieza directamente
            </p>
          )}
        </motion.div>

        {/* ── Stat card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78, duration: 0.4, ease }}
          style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: '20px',
            padding: '28px 24px',
            textAlign: 'center',
            boxShadow: C.shadow,
          }}
        >
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(32px, 9vw, 44px)',
            fontWeight: 800,
            color: C.green,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: '8px',
          }}>
            <AnimatedNumber target={stats.total_perfiles} duration={1.6} />
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: C.textLight,
            margin: 0,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
          }}>
            Perfiles generados hoy
          </p>
        </motion.div>

        {/* ── Footer ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: C.textLight,
            textAlign: 'center',
            margin: '28px 0 0',
            lineHeight: 1.6,
          }}
        >
          Meridian no almacena datos personales sin tu consentimiento.
          <br />
          Claude Impact Lab Chile 2026
        </motion.p>

      </div>
    </div>
  )
}
