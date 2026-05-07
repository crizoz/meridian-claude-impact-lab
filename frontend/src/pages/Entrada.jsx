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
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
      <rect x="4" y="10" width="40" height="28" rx="4" fill="#F1F0EC" stroke="#1A1A1A" strokeWidth="2.5" />
      <line x1="4" y1="18" x2="44" y2="18" stroke="#1A1A1A" strokeWidth="2.5" />
      <rect x="10" y="24" width="8" height="6" rx="1" fill="#DCD8CF" />
      <line x1="22" y1="26" x2="36" y2="26" stroke="#A8A6A0" strokeWidth="2" strokeLinecap="round" />
      <g transform="translate(30, 24)">
        <circle cx="6" cy="6" r="10" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M3 3 L9 9 M9 3 L3 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function IconTax() {
  return (
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="4" width="26" height="34" rx="3" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2.5" />
      <line x1="14" y1="12" x2="28" y2="12" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="18" x2="28" y2="18" stroke="#DCD8CF" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="24" x2="24" y2="24" stroke="#DCD8CF" strokeWidth="2.5" strokeLinecap="round" />
      <g transform="translate(18, 22)">
        <rect x="0" y="0" width="26" height="16" rx="3" fill="#4ADE80" stroke="#1A1A1A" strokeWidth="2.5" />
        <circle cx="13" cy="8" r="3" fill="#1A1A1A" />
      </g>
      <circle cx="36" cy="12" r="10" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M32 12 L35 15 L40 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconGrowth() {
  return (
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
      <circle cx="14" cy="36" r="8" fill="#FCD34D" stroke="#1A1A1A" strokeWidth="2.5" />
      <circle cx="26" cy="30" r="8" fill="#FBBF24" stroke="#1A1A1A" strokeWidth="2.5" />
      <g transform="translate(20, 4) rotate(45)">
        <path d="M0 8 Q 8 -4 16 8 L 16 20 L 0 20 Z" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2.5" />
        <circle cx="8" cy="10" r="2.5" fill="#1A1A1A" />
        <path d="M -2 20 L 18 20 L 14 26 L 2 26 Z" fill="#F97316" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
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
        background: C.bgCard2,
        border: `1px solid ${C.lineSoft}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        borderRadius: 14,
        padding: '28px 24px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        animation: `fade-up 0.5s ${delayMs}ms both ease-out`,
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        opacity: pressed ? 0.9 : 1,
        transition: 'transform 0.15s ease, opacity 0.15s ease',
      }}
    >
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
        {icon}
      </div>

      <div style={{
        fontSize: 18, fontWeight: 800, color: C.ink,
        letterSpacing: '-0.015em', lineHeight: 1.25, marginBottom: 10,
      }}>
        {titulo}
      </div>

      <div style={{
        fontSize: 13.5, color: C.inkSoft, lineHeight: 1.55, marginBottom: 24, flex: 1
      }}>
        {descripcion}
      </div>

      <div style={{ width: '100%', height: 1, background: C.lineSoft, marginBottom: 16 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 8 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: C.accent }}>
          {ctaText}
        </span>
        <span style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginTop: -2 }}>→</span>
      </div>
    </button>
  )
}

export default function Entrada() {
  const navigate = useNavigate()
  const perfiles = useCounter(15, 2200)
  const informales = useCounter(2000000, 1000)
  const [dotBlink, setDotBlink] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setDotBlink(v => !v), 900)
    return () => clearInterval(t)
  }, [])

  const handleStart = (dolor) => {
    sessionStorage.removeItem('meridian_messages')
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

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 22px 60px' }}>

        {/* Hero */}
        <div style={{
          padding: '36px 0 24px',
          animation: 'fade-up 0.5s 0.05s both ease-out',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{
              background: C.bgCard2, border: `1px solid ${C.line}`,
              borderRadius: 100, padding: '6px 16px',
              fontSize: 12, fontWeight: 700, color: C.inkMid,
            }}>
              ✨ Construido para Claude Impact Lab
            </span>
          </div>
          <div style={{
            fontSize: 'clamp(52px, 14vw, 76px)',
            fontWeight: 800, color: C.accent,
            letterSpacing: '-0.03em', lineHeight: 1,
            marginBottom: 14, textAlign: 'center',
          }}>
            {informales}
          </div>
          <p style={{
            fontSize: 18, color: C.inkMid, lineHeight: 1.45,
            fontWeight: 500, maxWidth: 360, margin: '0 auto 20px',
            textAlign: 'center',
          }}>
            de chilenos como tú, trabajan en la informalidad.
          </p>

          {/* Contexto del problema */}
          <div style={{
            background: C.bgCard2, border: `1px solid ${C.line}`,
            borderRadius: 14, padding: '24px 32px', marginBottom: 12,
            maxWidth: 640, margin: '0 auto',
          }}>
            <p style={{
              fontSize: 15.5, color: C.inkMid, lineHeight: 1.6, margin: 0, fontWeight: 400,
              textAlign: 'center',
            }}>
              Sin acceso a crédito. Sin beneficios del Estado. No porque no lo merezcan —
              sino porque nadie les mostró en números reales qué ganarían al formalizarse.
            </p>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            margin: '24px 0 40px', flexWrap: 'wrap'
          }}>
            <span style={{
              background: 'linear-gradient(180deg, #E8EFEA, #D6E7DD)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7), 0 2px 4px rgba(15,61,46,0.06)',
              color: C.accent,
              padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700,
            }}>Sin RUT necesario</span>
            <span style={{
              background: 'linear-gradient(180deg, #E8EFEA, #D6E7DD)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7), 0 2px 4px rgba(15,61,46,0.06)',
              color: C.accent,
              padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700,
            }}>Sin compromiso</span>
            <span style={{
              background: 'linear-gradient(180deg, #E8EFEA, #D6E7DD)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7), 0 2px 4px rgba(15,61,46,0.06)',
              color: C.accent,
              padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700,
            }}>100% gratis</span>
          </div>
          {/* Separador */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, maxWidth: 500, margin: '0 auto 24px',
            animation: 'fade-up 0.5s 0.15s both ease-out',
          }}>
            <div style={{ flex: 1, height: 1, background: C.lineSoft }} />
            <span style={{
              fontSize: 11, fontWeight: 700, color: C.inkFaint,
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              ¿Cuál es tu situación?
            </span>
            <div style={{ flex: 1, height: 1, background: C.lineSoft }} />
          </div>

          {/* Cards de dolor */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16,
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
              descripcion="Hay subsidios Sercotec, créditos Corfo 
y beneficios del Estado que no puedes 
usar mientras seas informal."
              ctaText="Ver beneficios disponibles"
              onClick={() => handleStart('quiero_crecer')}
              delayMs={120}
            />
          </div>

          {/* Alternativa WhatsApp */}
          <div style={{
            marginTop: 32,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            animation: 'fade-up 0.5s 250ms both ease-out',
          }}>
            <p style={{
              fontSize: 16, fontWeight: 700, color: C.ink,
              textAlign: 'center', marginBottom: 12,
            }}>
              O habla con Meridian por WhatsApp
            </p>
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '14155238886'}?text=Hola+Meridian%2C+necesito+ayuda+con+mi+negocio`}
              target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: 'fit-content', padding: '12px 24px',
                background: '#25D366', color: '#FFF',
                borderRadius: 100, textDecoration: 'none',
                fontWeight: 700, fontSize: 15,
                transition: 'transform 0.15s ease, opacity 0.15s ease',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Iniciar chat en WhatsApp
            </a>
          </div>

          {/* Contador — social proof prominente */}
          <div style={{
            marginTop: 40,
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
        </div>

        <p style={{
          fontSize: 12, color: C.inkFaint,
          textAlign: 'center', marginTop: 32, lineHeight: 1.6,
        }}>
          Meridian no almacena datos personales sin tu consentimiento.
        </p>

      </div>
    </div>
  )
}
