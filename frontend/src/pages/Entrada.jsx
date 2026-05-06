// Entrada — diseño basado en referencia Meridian.zip

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Tokens de color ──────────────────────────────────────────────────────────
const C = {
  bg:        '#F8F4ED',
  bgCard:    '#EDEAE3',
  bgCard2:   '#FFFFFF',
  ink:       '#1A1A1A',
  inkMid:    '#4A4A48',
  inkSoft:   '#76756F',
  inkFaint:  '#A8A6A0',
  line:      '#DCD8CF',
  lineSoft:  '#E8E5DC',
  accent:    '#0F3D2E',
  accentDeep:'#082319',
}

// ─── Contador animado (RAF — sin dependencias externas) ───────────────────────
function useCounter(target, duration = 2000) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf, t0
    const tick = (t) => {
      if (!t0) t0 = t
      const p = Math.min((t - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(Math.floor(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return v.toLocaleString('es-CL')
}

// ─── Iconos ───────────────────────────────────────────────────────────────────
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

function IconArrow({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function MeridianLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img src="/Logo.png" alt="Meridian" width={28} height={28}
        style={{ objectFit: 'contain', flexShrink: 0 }} />
      <span style={{
        fontFamily: "'Inter Tight', system-ui, sans-serif",
        fontSize: 16, fontWeight: 800, color: C.ink,
        letterSpacing: '0.10em', textTransform: 'uppercase',
      }}>
        Meridian
      </span>
    </div>
  )
}

// ─── Tarjeta de dolor — navega directamente al hacer clic ─────────────────────
function PainCard({ icon, titulo, descripcion, onClick, delayMs }) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        width: '100%',
        background: C.bgCard,
        border: 'none',
        borderRadius: 18,
        padding: '20px 22px 22px',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        animation: `fade-up 0.5s ${delayMs}ms both ease-out`,
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        opacity: pressed ? 0.85 : 1,
        transition: 'transform 0.15s ease, opacity 0.15s ease',
      }}
    >
      {/* Icono */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: C.bgCard2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.ink,
        marginBottom: 36,
        flexShrink: 0,
      }}>
        {icon}
      </div>

      {/* Título */}
      <div style={{
        fontSize: 22, fontWeight: 700, color: C.ink,
        letterSpacing: '-0.015em', lineHeight: 1.15,
        marginBottom: 10,
      }}>
        {titulo}
      </div>

      {/* Descripción */}
      <div style={{
        fontSize: 13.5, color: C.inkSoft, lineHeight: 1.55,
        marginBottom: 20,
      }}>
        {descripcion}
      </div>

      {/* Flecha verde — señal visual de que es un botón */}
      <div style={{
        alignSelf: 'flex-end',
        width: 32, height: 32, borderRadius: '50%',
        background: C.accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.bg,
        flexShrink: 0,
      }}>
        <IconArrow size={14} />
      </div>
    </button>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function Entrada() {
  const navigate = useNavigate()
  const perfiles = useCounter(14592, 2200)

  const handleStart = (dolor) => {
    sessionStorage.setItem('meridian_dolor', dolor)
    navigate('/preguntas')
  }

  return (
    <div style={{ minHeight: '100svh', background: C.bg }}>

      {/* ── Header ── */}
      <div style={{
        padding: '18px 22px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.lineSoft}`,
        animation: 'fade-in 0.4s both ease-out',
      }}>
        <MeridianLogo />
        <div style={{
          background: C.bgCard2,
          border: `1px solid ${C.line}`,
          borderRadius: 100,
          padding: '5px 14px',
          fontSize: 11, fontWeight: 600,
          color: C.inkMid, letterSpacing: '0.06em',
        }}>
          IA · Gratis
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 22px 60px' }}>

        {/* ── Hero ── */}
        <div style={{
          textAlign: 'center', padding: '36px 0 20px',
          animation: 'fade-up 0.5s 0.05s both ease-out',
        }}>
          <div style={{
            fontSize: 'clamp(52px, 14vw, 76px)',
            fontWeight: 800, color: C.accent,
            letterSpacing: '-0.03em', lineHeight: 1,
            marginBottom: 18,
          }}>
            2.000.000
          </div>
          <p style={{
            fontSize: 17, color: C.inkMid, lineHeight: 1.45,
            fontWeight: 400, maxWidth: 280, margin: '0 auto',
          }}>
            más de la mitad trabaja en la informalidad.
          </p>
        </div>

        {/* ── Cards de dolor ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 14,
          padding: '20px 0 8px',
        }}>
          <PainCard
            icon={<IconCredit />}
            titulo="No puedo pedir créditos"
            descripcion="Sin historial formal, el sistema tradicional te cierra las puertas. Descubre cómo construir tu reputación."
            onClick={() => handleStart('credito_rechazado')}
            delayMs={100}
          />
          <PainCard
            icon={<IconTax />}
            titulo="Impuestos me asustan"
            descripcion="El laberinto fiscal es intimidante. Simplificamos tus obligaciones para que operes con tranquilidad."
            onClick={() => handleStart('necesito_boleta')}
            delayMs={180}
          />
          <PainCard
            icon={<IconGrowth />}
            titulo="Quiero crecer"
            descripcion="Tienes el talento, te faltan las herramientas. Formaliza tu negocio y accede a nuevos mercados."
            onClick={() => handleStart('quiero_crecer')}
            delayMs={260}
          />
        </div>

        {/* ── CTA ── */}
        <div style={{
          padding: '32px 0 8px',
          display: 'flex', justifyContent: 'center',
          animation: 'fade-up 0.5s 400ms both ease-out',
        }}>
          <button
            onClick={() => handleStart('quiero_crecer')}
            style={{
              background: C.accent, color: C.bg,
              border: 'none', borderRadius: 100,
              padding: '14px 24px',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            INICIAR MI CAMINO
            <span style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconArrow size={14} />
            </span>
          </button>
        </div>

        {/* ── Tarjeta estadística ── */}
        <div style={{
          padding: '8px 0 24px',
          animation: 'fade-up 0.5s 500ms both ease-out',
        }}>
          <div style={{
            background: 'transparent',
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            padding: '18px 22px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 30, fontWeight: 700, color: C.ink,
              letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6,
            }}>
              {perfiles}
            </div>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: C.inkSoft,
            }}>
              Perfiles generados hoy
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
