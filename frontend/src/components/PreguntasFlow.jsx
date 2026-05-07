// PreguntasFlow — UI conversacional
//
// Props:
//   messages:  [{role: 'user'|'assistant', content: string}]
//   onSend:    (respuesta: string) => void
//   isLoading: boolean
//
// El input de texto libre es siempre el método principal.
// Los botones de opciones rápidas aparecen debajo como método secundario.

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const C = {
  bg: '#F8F4ED',
  bgCard: '#EDEAE3',
  bgCard2: '#FFFFFF',
  ink: '#1A1A1A',
  inkSoft: '#76756F',
  inkFaint: '#A8A6A0',
  line: '#DCD8CF',
  accent: '#0F3D2E',
}

const ease = [0.22, 1, 0.36, 1]

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '14155238886'
const WA_TEXT = encodeURIComponent('Hola! Quiero recibir asesoría para formalizar mi negocio con Meridian.')

// ── CSS Keyframes ──────────────────────────────────────────────────────────
const LOADING_CSS = `
@keyframes ml-enter {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ml-exit {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-8px); }
}
@keyframes ml-pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.08); }
}
@keyframes ml-scan {
  0%, 100% { transform: translateX(-4px); }
  50%       { transform: translateX(4px); }
}
@keyframes ml-flip {
  0%   { transform: perspective(200px) rotateY(0deg); }
  50%  { transform: perspective(200px) rotateY(180deg); }
  100% { transform: perspective(200px) rotateY(360deg); }
}
@keyframes ml-spring-in {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}
@keyframes ml-draw-check {
  from { stroke-dashoffset: 30; }
  to   { stroke-dashoffset: 0; }
}
@keyframes ml-overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes ml-overlay-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
@keyframes ml-card-in {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
`
if (typeof document !== 'undefined' && !document.getElementById('meridian-loading-css')) {
  const s = document.createElement('style')
  s.id = 'meridian-loading-css'
  s.textContent = LOADING_CSS
  document.head.appendChild(s)
}

function BotAvatar() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: C.accent,
      marginRight: 10, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginTop: 2,
    }}>
      <img src="/Logo.svg" alt=""
        style={{ height: 20, width: 20, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
    </div>
  )
}

function Mensaje({ role, content }) {
  const isUser = role === 'user'
  const texto = content.replace(/\[OPCIONES:[^\]]+\]/g, '').trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 8,
      }}
    >
      {!isUser && <BotAvatar />}
      <div style={{
        maxWidth: '78%',
        background: isUser ? C.accent : C.bgCard,
        color: isUser ? C.bg : C.ink,
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        fontSize: 14.5, lineHeight: 1.5, fontWeight: 400,
      }}>
        {texto}
      </div>
    </motion.div>
  )
}

function parsearOpciones(content) {
  const match = content.match(/\[OPCIONES:\s*([^\]]+)\]/i)
  if (!match) return null
  return match[1].split('|').map(o => o.trim()).filter(Boolean)
}

function IconSend() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function OpcionButton({ label, index, onClick, disabled }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.04, duration: 0.25, ease }}
      whileTap={{ scale: 0.97, opacity: 0.85 }}
      onClick={onClick}
      disabled={disabled}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        width: '100%',
        textAlign: 'left',
        background: C.bgCard,
        border: `1.5px solid ${hovered ? C.accent : 'transparent'}`,
        borderRadius: 12,
        padding: '11px 14px',
        fontSize: 13.5, fontWeight: 500,
        color: C.ink,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      {label}
      <span style={{ color: C.inkSoft, flexShrink: 0, marginLeft: 8, fontSize: 14 }}>→</span>
    </motion.button>
  )
}

// ── Iconos SVG inline ──────────────────────────────────────────────────────
function SvgMicrofono() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}

function SvgLupa() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function SvgDinero() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function SvgCheck() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
      stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline
        points="5 12 10 17 19 8"
        strokeDasharray="30"
        style={{ strokeDashoffset: 30, animation: 'ml-draw-check 0.4s ease-out 0.35s both' }}
      />
    </svg>
  )
}

const ETAPAS = [
  { icono: 'microfono', texto: 'Entendiendo tu situación...' },
  { icono: 'lupa',      texto: 'Consultando datos del SII...' },
  { icono: 'dinero',    texto: 'Calculando tus beneficios...' },
  { icono: 'check',     texto: '¡Tu análisis está listo!' },
]

function iconSvg(icono) {
  if (icono === 'microfono') return <SvgMicrofono />
  if (icono === 'lupa') return <SvgLupa />
  if (icono === 'dinero') return <SvgDinero />
  return <SvgCheck />
}

function iconAnim(icono) {
  if (icono === 'microfono') return 'ml-pulse 1.4s 0.2s ease-in-out infinite'
  if (icono === 'lupa')      return 'ml-scan 0.8s 0.2s ease-in-out infinite'
  if (icono === 'dinero')    return 'ml-flip 1.6s 0.2s ease-in-out infinite'
  return 'ml-spring-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both'
}

function StageIcon({ stage, size = 56 }) {
  const { icono } = ETAPAS[stage]
  const isCheck = stage === 3
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: isCheck ? C.accent : 'rgba(15,61,46,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: isCheck ? 'white' : C.accent,
      animation: iconAnim(icono),
    }}>
      {iconSvg(icono)}
    </div>
  )
}

function Typing() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
      <BotAvatar />
      <div style={{
        background: C.bgCard,
        padding: '14px 18px',
        borderRadius: '4px 18px 18px 18px',
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: C.inkSoft, display: 'inline-block',
            animation: `pulse-soft 1.2s ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

function LoadingAnimation({ isLoading, onDone }) {
  const [etapa, setEtapa] = useState(0)
  const [displayedStage, setDisplayedStage] = useState(0)
  const [leavingStage, setLeavingStage] = useState(null)
  const [overlayExiting, setOverlayExiting] = useState(false)
  const onDoneRef = useRef(onDone)
  const displayedStageRef = useRef(0)
  useEffect(() => { onDoneRef.current = onDone }, [onDone])

  // Stages cada 900ms
  useEffect(() => {
    const t1 = setTimeout(() => setEtapa(1), 900)
    const t2 = setTimeout(() => setEtapa(2), 1800)
    const t3 = setTimeout(() => setEtapa(3), 2700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Transition animation when etapa changes
  useEffect(() => {
    if (etapa === displayedStageRef.current) return
    const prev = displayedStageRef.current
    displayedStageRef.current = etapa
    setLeavingStage(prev)
    setDisplayedStage(etapa)
    const t = setTimeout(() => setLeavingStage(null), 220)
    return () => clearTimeout(t)
  }, [etapa])

  // Exit: fade overlay out, then call onDone
  useEffect(() => {
    if (etapa === 3 && !isLoading) {
      const t = setTimeout(() => {
        setOverlayExiting(true)
        setTimeout(() => onDoneRef.current(), 400)
      }, 900)
      return () => clearTimeout(t)
    }
  }, [etapa, isLoading])

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(248,244,237,0.75)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      animation: overlayExiting
        ? 'ml-overlay-out 0.4s ease forwards'
        : 'ml-overlay-in 0.5s ease both',
    }}>
      <div style={{
        background: C.bgCard2,
        borderRadius: 24,
        padding: '44px 52px 36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.09), 0 4px 16px rgba(0,0,0,0.04)',
        minWidth: 240,
        animation: 'ml-card-in 0.55s cubic-bezier(0.34,1.56,0.64,1) both',
      }}>

        {/* Icon zone */}
        <div style={{ position: 'relative', width: 72, height: 72, marginBottom: 4 }}>
          <div
            key={`e-${displayedStage}`}
            style={{
              position: 'absolute', top: 0, left: 0,
              animation: displayedStage !== 3 ? 'ml-enter 0.25s ease both' : undefined,
            }}
          >
            <StageIcon stage={displayedStage} size={72} />
          </div>

          {leavingStage !== null && (
            <div
              key={`l-${leavingStage}`}
              style={{
                position: 'absolute', top: 0, left: 0,
                animation: 'ml-exit 0.25s ease forwards',
                pointerEvents: 'none',
              }}
            >
              <StageIcon stage={leavingStage} size={72} />
            </div>
          )}
        </div>

        {/* Stage text */}
        <p
          key={`t-${displayedStage}`}
          style={{
            fontSize: 14, fontWeight: 500, color: C.inkSoft,
            margin: '16px 0 14px 0', textAlign: 'center',
            whiteSpace: 'nowrap',
            animation: 'ml-enter 0.25s ease both',
          }}
        >
          {ETAPAS[displayedStage].texto}
        </p>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {ETAPAS.map((_, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: i === etapa ? C.accent : 'rgba(15,61,46,0.18)',
              transition: 'background 0.35s ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PreguntasFlow({ messages, onSend, isLoading, isFinalizing = false, onAnalysisDone }) {
  const [inputValor, setInputValor] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const [showLoadingAnim, setShowLoadingAnim] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isLoading && inputRef.current) inputRef.current.focus()
  }, [isLoading])

  // Arranca la animación final en cuanto el backend confirma que terminó
  useEffect(() => {
    if (isFinalizing) setShowLoadingAnim(true)
  }, [isFinalizing])

  const ultimoAsistente = [...messages].reverse().find(m => m.role === 'assistant')
  const opciones = ultimoAsistente ? parsearOpciones(ultimoAsistente.content) : null
  const esperandoRespuesta =
    messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    !isLoading

  const handleEnviar = () => {
    if (!inputValor.trim() || isLoading) return
    onSend(inputValor.trim())
    setInputValor('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  const canSend = !!inputValor.trim() && !isLoading

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Historial scrolleable */}
      <div className="meridian-chat-scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: '8px', paddingTop: '4px' }}>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <Mensaje key={i} role={m.role} content={m.content} />
          ))}
        </AnimatePresence>
        {isLoading && !isFinalizing && <Typing />}
        <div ref={bottomRef} />
      </div>

      {showLoadingAnim && (
        <LoadingAnimation
          isLoading={false}
          onDone={() => {
            setShowLoadingAnim(false)
            onAnalysisDone?.()
          }}
        />
      )}

      {/* Zona de respuesta */}
      {esperandoRespuesta && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease }}
          style={{ paddingTop: '10px', paddingBottom: '4px', flexShrink: 0 }}
        >
          {/* ── Input de texto libre — SIEMPRE primero ── */}
          <div style={{
            display: 'flex',
            gap: '8px',
            background: C.bgCard2,
            border: `1.5px solid ${inputFocused ? C.accent : C.line}`,
            borderRadius: '14px',
            padding: '4px 4px 4px 16px',
            transition: 'border-color 0.18s',
            marginBottom: opciones ? 12 : 0,
          }}>
            <input
              ref={inputRef}
              value={inputValor}
              onChange={e => setInputValor(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Escribe tu respuesta…"
              className="meridian-input"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: C.ink,
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontSize: '15px',
                padding: '11px 0',
              }}
            />
            <motion.button
              whileTap={canSend ? { scale: 0.94 } : {}}
              onClick={handleEnviar}
              disabled={!canSend}
              style={{
                background: canSend ? C.accent : C.line,
                border: 'none',
                borderRadius: '10px',
                padding: '10px 16px',
                color: canSend ? '#FFFFFF' : C.inkFaint,
                display: 'flex', alignItems: 'center', gap: '6px',
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontSize: '13px', fontWeight: 600,
                cursor: canSend ? 'pointer' : 'not-allowed',
                transition: 'all 0.18s',
                flexShrink: 0,
              }}
            >
              <IconSend />
              <span>Enviar</span>
            </motion.button>
          </div>

          {/* ── Opciones rápidas — SECUNDARIO, solo si existen ── */}
          {opciones && (
            <div>
              <p style={{
                fontSize: 10, fontWeight: 700, color: C.inkFaint,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                margin: '0 0 6px 2px',
              }}>
                O elige una opción
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {opciones.map((op, i) => (
                  <OpcionButton
                    key={op}
                    label={op}
                    index={i}
                    onClick={() => onSend(op)}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Botón WhatsApp — CTA contextual durante el flujo ── */}
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 14,
              padding: '11px 16px',
              background: '#25D366',
              borderRadius: 12,
              textDecoration: 'none',
              color: '#FFFFFF',
              fontSize: 13.5, fontWeight: 600,
            }}
          >
            <IconWhatsApp />
            Prefiero continuar por WhatsApp
          </a>
        </motion.div>
      )}
    </div>
  )
}
