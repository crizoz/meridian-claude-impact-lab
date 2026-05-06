// frontend/src/pages/Entrada.jsx
// Meridian — Landing page principal
// Fuentes requeridas en index.html:
// <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

// --- Contador animado de número grande ---
function AnimatedNumber({ target, duration = 2 }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.floor(v).toLocaleString('es-CL'))
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    const controls = animate(count, target, {
      duration,
      ease: 'easeOut',
      onUpdate: v => setDisplay(Math.floor(v).toLocaleString('es-CL'))
    })
    return controls.stop
  }, [target])

  return <span>{display}</span>
}

// --- Card de punto de dolor ---
function PainCard({ icon, titulo, descripcion, onClick, delay }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(251, 191, 36, 0.06)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '28px 24px',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        transition: 'background 0.2s',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '18px',
        fontWeight: 700,
        color: '#F5F0E8',
        margin: '0 0 8px',
        lineHeight: 1.3,
      }}>
        {titulo}
      </p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        color: 'rgba(245,240,232,0.5)',
        margin: 0,
        lineHeight: 1.6,
      }}>
        {descripcion}
      </p>
      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#FBBF24',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px',
        fontWeight: 500,
      }}>
        Calcular mis beneficios
        <span style={{ fontSize: '16px' }}>→</span>
      </div>
    </motion.button>
  )
}

// --- Stat chip ---
function StatChip({ valor, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        background: 'rgba(251,191,36,0.08)',
        border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: '100px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '15px',
        fontWeight: 700,
        color: '#FBBF24',
      }}>
        {valor}
      </span>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px',
        color: 'rgba(245,240,232,0.5)',
      }}>
        {label}
      </span>
    </motion.div>
  )
}

export default function Entrada() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total_perfiles: 0,
    total_planes_enviados: 0,
  })

  useEffect(() => {
    // TODO: fetch desde /api/stats cuando el backend esté listo
    // fetch(`${import.meta.env.VITE_API_URL}/stats`)
    //   .then(r => r.json())
    //   .then(setStats)
    //   .catch(() => {})

    // Placeholder para desarrollo
    setStats({ total_perfiles: 124, total_planes_enviados: 87 })
  }, [])

  const handlePain = (dolor) => {
    // Guarda el dolor seleccionado en sessionStorage para el flujo de preguntas
    sessionStorage.setItem('meridian_dolor', dolor)
    navigate('/preguntas')
  }

  const pains = [
    {
      icon: '🏦',
      titulo: 'Me rechazaron un crédito',
      descripcion: 'Sin RUT tributario activo, ningún banco puede evaluarte aunque tu negocio funcione.',
      dolor: 'credito_rechazado',
      delay: 0.55,
    },
    {
      icon: '📄',
      titulo: 'Me pidieron boleta',
      descripcion: 'Mercado Libre, un cliente grande o el municipio — el muro siempre es el mismo.',
      dolor: 'necesito_boleta',
      delay: 0.65,
    },
    {
      icon: '📈',
      titulo: 'Quiero hacer crecer mi negocio',
      descripcion: 'Hay beneficios estatales, créditos Fogape y programas Corfo que no puedes usar aún.',
      dolor: 'quiero_crecer',
      delay: 0.75,
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F0E0C',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Textura de fondo sutil */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(251,191,36,0.12) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Línea diagonal decorativa */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: '15%',
        width: '1px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(251,191,36,0.15), transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '560px',
        margin: '0 auto',
        padding: '0 24px',
        paddingBottom: '80px',
      }}>

        {/* Logo / nombre */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            paddingTop: '48px',
            paddingBottom: '64px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: '#FBBF24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#0F0E0C',
            }} />
          </div>
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '18px',
            fontWeight: 700,
            color: '#F5F0E8',
            letterSpacing: '-0.02em',
          }}>
            Meridian
          </span>
        </motion.div>

        {/* Hero — el número primero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '16px' }}
        >
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(56px, 14vw, 88px)',
            fontWeight: 800,
            color: '#F5F0E8',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}>
            <AnimatedNumber target={1800000} duration={2.2} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{ marginBottom: '48px' }}
        >
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(20px, 5vw, 26px)',
            fontWeight: 700,
            color: '#FBBF24',
            margin: '0 0 12px',
            lineHeight: 1.2,
          }}>
            microemprendedores en Chile
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            color: 'rgba(245,240,232,0.55)',
            margin: 0,
            lineHeight: 1.7,
            maxWidth: '420px',
          }}>
            Sin acceso a crédito. Sin beneficios del Estado. No porque no lo merezcan —
            sino porque nadie les mostró en números reales qué ganarían al formalizarse.
          </p>
        </motion.div>

        {/* Stats en tiempo real */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '48px',
          }}
        >
          <StatChip
            valor={stats.total_perfiles.toLocaleString('es-CL')}
            label="perfiles calculados"
            delay={0.4}
          />
          <StatChip
            valor={stats.total_planes_enviados.toLocaleString('es-CL')}
            label="planes enviados"
            delay={0.45}
          />
          <StatChip
            valor="15"
            label="regiones"
            delay={0.5}
          />
        </motion.div>

        {/* Pregunta de entrada */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 500,
            color: 'rgba(245,240,232,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: '0 0 16px',
          }}
        >
          ¿Por qué llegaste hoy?
        </motion.p>

        {/* Pain cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

        {/* Footer mínimo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: 'rgba(245,240,232,0.2)',
            textAlign: 'center',
            marginTop: '48px',
            lineHeight: 1.6,
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