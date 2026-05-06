// frontend/src/pages/Entrada.jsx

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const C = {
  bg: '#F8F4ED',
  bgCard: '#EDEAE3',
  bgCard2: '#FFFFFF',
  ink: '#1A1A1A',
  inkMid: '#4A4A48',
  inkSoft: '#76756F',
  inkFaint: '#A8A6A0',
  line: '#DCD8CF',
  lineSoft: '#E8E5DC',
  accent: '#0F3D2E',
}

// Contador animado sin dependencias externas (RAF)
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

function PainCard({ icon, titulo, descripcion, ctaText, onClick, delayMs }) {
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
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: C.bgCard2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.ink, marginBottom: 14, flexShrink: 0,
      }}>
        {icon}
      </div>

      <div style={{
        fontSize: 20, fontWeight: 700, color: C.ink,
        letterSpacing: '-0.015em', lineHeight: 1.2, marginBottom: 8,
      }}>
        {titulo}
      </div>

      <div style={{
        fontSize: 13.5, color: C.inkSoft, lineHeight: 1.6, marginBottom: 18,
      }}>
        {descripcion}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>
          {ctaText}
        </span>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: C.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.bg, flexShrink: 0,
        }}>
          <IconArrow size={14} />
        </div>
      </div>
    </button>
  )
}

export default function Entrada() {
  const navigate = useNavigate()
  const perfiles = useCounter(14592, 2200)
  const [dotBlink, setDotBlink] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setDotBlink(v => !v), 900)
    return () => clearInterval(t)
  }, [])

  const handleStart = (dolor) => {
    sessionStorage.setItem('meridian_dolor', dolor)
    navigate('/preguntas')
  }

  return (
    <div style={{ minHeight: '100svh', background: C.bg }}>

      {/* Header */}
      <div style={{
        padding: '18px 22px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.lineSoft}`,
        animation: 'fade-in 0.4s both ease-out',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/Logo.svg" alt="Meridian"
            style={{ height: 28, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 16, fontWeight: 800, color: C.ink,
            letterSpacing: '0.10em', textTransform: 'uppercase',
          }}>
            Meridian
          </span>
        </div>
        <div style={{
          background: C.bgCard2, border: `1px solid ${C.line}`,
          borderRadius: 100, padding: '5px 14px',
          fontSize: 11, fontWeight: 600, color: C.inkMid, letterSpacing: '0.06em',
        }}>
          IA · Gratis
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 22px 60px' }}>

        {/* Hero */}
        <div style={{
          padding: '36px 0 24px',
          animation: 'fade-up 0.5s 0.05s both ease-out',
        }}>
          <div style={{
            fontSize: 'clamp(52px, 14vw, 76px)',
            fontWeight: 800, color: C.accent,
            letterSpacing: '-0.03em', lineHeight: 1,
            marginBottom: 14, textAlign: 'center',
          }}>
            2.000.000
          </div>
          <p style={{
            fontSize: 18, color: C.inkMid, lineHeight: 1.45,
            fontWeight: 500, maxWidth: 320, margin: '0 auto 20px',
            textAlign: 'center',
          }}>
            de chilenos trabajan en la informalidad.
          </p>

          {/* Contexto del problema */}
          <div style={{
            background: C.bgCard2, border: `1px solid ${C.line}`,
            borderRadius: 14, padding: '16px 20px', marginBottom: 8,
          }}>
            <p style={{
              fontSize: 15, color: C.inkMid, lineHeight: 1.7, margin: 0, fontWeight: 400,
            }}>
              Sin acceso a crédito. Sin beneficios del Estado. No porque no lo merezcan —
              sino porque nadie les mostró en números reales qué ganarían al formalizarse.
            </p>
          </div>

          <p style={{
            fontSize: 12, color: C.inkFaint, textAlign: 'center',
            margin: '10px 0 0', fontWeight: 500, letterSpacing: '0.04em',
          }}>
            Sin RUT necesario · Sin compromiso · 100% gratis
          </p>
        </div>

        {/* Separador */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          animation: 'fade-up 0.5s 0.15s both ease-out',
        }}>
          <div style={{ flex: 1, height: 1, background: C.lineSoft }} />
          <span style={{
            fontSize: 11, fontWeight: 600, color: C.inkFaint,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            ¿Cuál es tu situación?
          </span>
          <div style={{ flex: 1, height: 1, background: C.lineSoft }} />
        </div>

        {/* Cards de dolor */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 12,
          animation: 'fade-up 0.5s 0.2s both ease-out',
        }}>
          <PainCard
            icon={<IconCredit />}
            titulo="Me rechazaron un crédito"
            descripcion="Sin RUT tributario activo, los bancos no pueden evaluarte aunque tu negocio facture bien. Hay 8 alternativas que aún no conoces."
            ctaText="Ver mis opciones de crédito"
            onClick={() => handleStart('credito_rechazado')}
            delayMs={0}
          />
          <PainCard
            icon={<IconTax />}
            titulo="Me pidieron boleta y no puedo emitir"
            descripcion="Mercado Libre, un cliente corporativo, el municipio — siempre el mismo muro. Formalizarte toma 30 minutos en SII.cl."
            ctaText="Calcular qué pierdo sin boleta"
            onClick={() => handleStart('necesito_boleta')}
            delayMs={60}
          />
          <PainCard
            icon={<IconGrowth />}
            titulo="Quiero hacer crecer mi negocio"
            descripcion="Hay subsidios Sercotec, créditos Corfo y programas del Estado que no puedes usar mientras seas informal. Calculemos cuánto te corresponde."
            ctaText="Ver beneficios disponibles"
            onClick={() => handleStart('quiero_crecer')}
            delayMs={120}
          />
        </div>

        {/* Contador — social proof prominente */}
        <div style={{
          marginTop: 28,
          animation: 'fade-up 0.5s 350ms both ease-out',
        }}>
          <div style={{
            background: C.accent, borderRadius: 16,
            padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 18,
          }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: dotBlink ? '#4ADE80' : 'rgba(74,222,128,0.3)',
                  transition: 'background 0.4s ease',
                }} />
              </div>
            </div>
            <div>
              <div style={{
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontSize: 32, fontWeight: 800, color: '#FFFFFF',
                letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4,
              }}>
                {perfiles}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.10em', textTransform: 'uppercase',
              }}>
                perfiles calculados hoy · en vivo
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          fontSize: 12, color: C.inkFaint,
          textAlign: 'center', marginTop: 32, lineHeight: 1.6,
        }}>
          Meridian no almacena datos personales sin tu consentimiento.
          <br />
          Construido en Claude Impact Lab Chile 2026.
        </p>

      </div>
    </div>
  )
}
