// PreguntasFlow — UI del flujo conversacional sobre fondo blanco
//
// Props:
//   messages:  [{role: 'user'|'assistant', content: string}]
//   onSend:    (respuesta: string) => void
//   isLoading: boolean

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Sistema de diseño ────────────────────────────────────────────────────────
const C = {
  bg:          '#FAFAF8',
  bgWhite:     '#FFFFFF',
  text:        '#18181B',
  textMid:     '#52525B',
  textMuted:   '#71717A',
  textFaint:   '#A1A1AA',
  amber:       '#F59E0B',
  amberDark:   '#D97706',
  amberBorder: '#FCD34D',
  amberLight:  '#FEF3C7',
  border:      '#E4E4E7',
  // Burbujas
  asstBg:      '#F4F4F5',   // gris claro para Meridian
  asstText:    '#18181B',
  userBg:      '#18181B',   // oscuro para el usuario
  userText:    '#FFFFFF',
}

const ease = [0.22, 1, 0.36, 1]

// ─── Avatar de Meridian ───────────────────────────────────────────────────────
function MeridianAvatar() {
  return (
    <div style={{
      width: '30px',
      height: '30px',
      borderRadius: '9px',
      background: '#18181B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginRight: '8px',
      marginTop: '2px',
    }}>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '13px',
        fontWeight: 800,
        color: C.amber,
        letterSpacing: '-0.04em',
        lineHeight: 1,
      }}>M</span>
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
      transition={{ duration: 0.35, ease }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-start',
        marginBottom: '12px',
      }}
    >
      {!isUser && <MeridianAvatar />}

      <div style={{
        maxWidth: '78%',
        background: isUser ? C.userBg : C.asstBg,
        borderRadius: isUser
          ? '18px 18px 4px 18px'
          : '4px 18px 18px 18px',
        padding: '12px 16px',
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '15px',
          fontWeight: 400,
          color: isUser ? C.userText : C.asstText,
          margin: 0,
          lineHeight: 1.65,
        }}>
          {texto}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Skeleton mientras Claude procesa ────────────────────────────────────────
function SkeletonBurbuja() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.3, repeat: Infinity }}
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '9px',
          background: '#D4D4D8',
          flexShrink: 0,
          marginRight: '8px',
        }}
      />
      <div style={{
        background: C.asstBg,
        borderRadius: '4px 18px 18px 18px',
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {[140, 200, 100].map((w, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            style={{
              width: `${w}px`,
              height: '12px',
              background: '#D4D4D8',
              borderRadius: '6px',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Parser [OPCIONES: A | B | C] → ['A','B','C'] ────────────────────────────
function parsearOpciones(content) {
  const match = content.match(/\[OPCIONES:\s*([^\]]+)\]/)
  if (!match) return null
  return match[1].split('|').map(o => o.trim()).filter(Boolean)
}

// ─── Icono enviar ─────────────────────────────────────────────────────────────
function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

// ─── Botón de opción individual ───────────────────────────────────────────────
function OpcionButton({ label, index, onClick, disabled }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.28, ease }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered ? C.amberLight : C.bgWhite,
        border: `1.5px solid ${hovered ? C.amberBorder : '#D4D4D8'}`,
        borderRadius: '10px',
        padding: '10px 18px',
        color: hovered ? C.amberDark : C.text,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.18s',
        lineHeight: 1.2,
        boxShadow: hovered
          ? '0 2px 8px rgba(245,158,11,0.12)'
          : '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      {label}
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
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
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

      {/* Área de mensajes scrolleable */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '8px',
        paddingTop: '4px',
      }}>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <Mensaje key={i} role={m.role} content={m.content} />
          ))}
        </AnimatePresence>
        {isLoading && <SkeletonBurbuja />}
        <div ref={bottomRef} />
      </div>

      {/* Zona de respuesta */}
      {esperandoRespuesta && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease }}
          style={{ paddingTop: '12px', flexShrink: 0 }}
        >
          {opciones ? (
            // Botones de opción predefinidos
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
            // Input de texto libre
            <div style={{
              display: 'flex',
              gap: '8px',
              background: C.bgWhite,
              border: `1.5px solid ${inputFocused ? C.amberBorder : C.border}`,
              borderRadius: '14px',
              padding: '4px 4px 4px 16px',
              boxShadow: inputFocused
                ? '0 0 0 3px rgba(245,158,11,0.10)'
                : '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'border-color 0.18s, box-shadow 0.18s',
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
                  color: C.text,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '15px',
                  fontWeight: 400,
                  padding: '11px 0',
                }}
              />
              <motion.button
                whileTap={canSend ? { scale: 0.94 } : {}}
                onClick={handleEnviar}
                disabled={!canSend}
                style={{
                  background: canSend ? '#18181B' : '#F4F4F5',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  color: canSend ? '#FFFFFF' : C.textFaint,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: canSend ? 'pointer' : 'not-allowed',
                  transition: 'background 0.18s, color 0.18s',
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
