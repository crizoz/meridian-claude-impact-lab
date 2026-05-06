// PreguntasFlow — UI conversacional basada en referencia Meridian.zip
//
// Props:
//   messages:  [{role: 'user'|'assistant', content: string}]
//   onSend:    (respuesta: string) => void
//   isLoading: boolean

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Tokens de color ──────────────────────────────────────────────────────────
const C = {
  bg:        '#F8F4ED',
  bgCard:    '#EDEAE3',
  bgCard2:   '#FFFFFF',
  ink:       '#1A1A1A',
  inkSoft:   '#76756F',
  inkFaint:  '#A8A6A0',
  line:      '#DCD8CF',
  accent:    '#0F3D2E',
}

const ease = [0.22, 1, 0.36, 1]

// ─── Avatar circular del asistente ───────────────────────────────────────────
function BotAvatar() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: C.accent,
      marginRight: 10, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginTop: 2,
    }}>
      <img
        src="/Logo.png"
        alt=""
        width={20}
        height={20}
        style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
      />
    </div>
  )
}

// ─── Burbuja de mensaje ───────────────────────────────────────────────────────
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

// ─── Indicador de escritura (3 puntos pulsantes) ──────────────────────────────
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
            background: C.inkSoft,
            display: 'inline-block',
            animation: `pulse-soft 1.2s ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

// ─── Parser de opciones del marcador [OPCIONES: A | B] ────────────────────────
function parsearOpciones(content) {
  const match = content.match(/\[OPCIONES:\s*([^\]]+)\]/)
  if (!match) return null
  return match[1].split('|').map(o => o.trim()).filter(Boolean)
}

// ─── Flecha derecha ───────────────────────────────────────────────────────────
function IconArrow({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

// ─── Icono de envío ───────────────────────────────────────────────────────────
function IconSend() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

// ─── Botón de opción — ancho completo, flecha a la derecha ───────────────────
function OpcionButton({ label, index, onClick, disabled }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05, duration: 0.28, ease }}
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
        borderRadius: 14,
        padding: '14px 16px',
        fontSize: 14, fontWeight: 500,
        color: C.ink,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      {label}
      <span style={{ color: C.inkSoft, flexShrink: 0, marginLeft: 8 }}>
        <IconArrow size={14} />
      </span>
    </motion.button>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function PreguntasFlow({ messages, onSend, isLoading }) {
  const [inputValor, setInputValor] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isLoading && inputRef.current) inputRef.current.focus()
  }, [isLoading])

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
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '8px', paddingTop: '4px' }}>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <Mensaje key={i} role={m.role} content={m.content} />
          ))}
        </AnimatePresence>
        {isLoading && <Typing />}
        <div ref={bottomRef} />
      </div>

      {/* Zona de respuesta */}
      {esperandoRespuesta && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease }}
          style={{ paddingTop: '12px', paddingBottom: '4px', flexShrink: 0 }}
        >
          {opciones ? (
            /* Opciones de respuesta rápida — botones full-width */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
          ) : (
            /* Input de texto libre */
            <div style={{
              display: 'flex',
              gap: '8px',
              background: C.bgCard2,
              border: `1.5px solid ${inputFocused ? C.accent : C.line}`,
              borderRadius: '14px',
              padding: '4px 4px 4px 16px',
              transition: 'border-color 0.18s',
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Inter Tight', system-ui, sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: canSend ? 'pointer' : 'not-allowed',
                  transition: 'all 0.18s',
                  flexShrink: 0,
                }}
              >
                <IconSend />
                <span>Enviar</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
