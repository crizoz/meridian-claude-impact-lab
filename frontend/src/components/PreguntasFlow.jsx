// PreguntasFlow — UI del flujo conversacional · estilo crema + verde forestal
//
// Props:
//   messages:  [{role: 'user'|'assistant', content: string}]
//   onSend:    (respuesta: string) => void
//   isLoading: boolean

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg:        '#F2EAE0',
  bgCard:    '#FFFFFF',
  green:     '#1B3224',
  greenMid:  '#2D5040',
  textGray:  '#78716C',
  textLight: '#A8A29E',
  border:    '#E2D9CE',
  // Burbujas
  asstBg:    '#FFFFFF',        // blanco sobre fondo crema
  asstBorder:'#E2D9CE',
  asstText:  '#1B3224',
  userBg:    '#1B3224',        // verde forestal para el usuario
  userText:  '#FFFFFF',
  // Opciones
  optBg:     '#FFFFFF',
  optBorder: '#E2D9CE',
  optHoverBg:'#F0F7F2',
  optHoverBorder: '#1B3224',
  optText:   '#1B3224',
}

const ease = [0.22, 1, 0.36, 1]

// ─── Avatar de Meridian ───────────────────────────────────────────────────────
function MeridianAvatar() {
  return (
    <img
      src="/meridian-logo.svg"
      alt="Meridian"
      width={30}
      height={30}
      style={{
        flexShrink: 0,
        marginRight: '8px',
        marginTop: '2px',
        objectFit: 'contain',
      }}
    />
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
        marginBottom: '12px',
      }}
    >
      {!isUser && <MeridianAvatar />}

      <div style={{
        maxWidth: '78%',
        background: isUser ? C.userBg : C.asstBg,
        border: isUser ? 'none' : `1px solid ${C.asstBorder}`,
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        padding: '12px 16px',
        boxShadow: isUser ? 'none' : '0 1px 3px rgba(27,50,36,0.06)',
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
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 1.3, repeat: Infinity }}
        style={{
          width: '30px', height: '30px',
          borderRadius: '8px',
          background: '#D4C8BC',
          flexShrink: 0,
          marginRight: '8px',
        }}
      />
      <div style={{
        background: C.asstBg,
        border: `1px solid ${C.asstBorder}`,
        borderRadius: '4px 18px 18px 18px',
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: '0 1px 3px rgba(27,50,36,0.06)',
      }}>
        {[130, 190, 95].map((w, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.12, 0.28, 0.12] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.22 }}
            style={{
              width: `${w}px`, height: '12px',
              background: '#D4C8BC',
              borderRadius: '6px',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Parser de opciones ───────────────────────────────────────────────────────
function parsearOpciones(content) {
  const match = content.match(/\[OPCIONES:\s*([^\]]+)\]/)
  if (!match) return null
  return match[1].split('|').map(o => o.trim()).filter(Boolean)
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

// ─── Botón de opción ──────────────────────────────────────────────────────────
function OpcionButton({ label, index, onClick, disabled }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.28, ease }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered ? C.optHoverBg : C.optBg,
        border: `1.5px solid ${hovered ? C.optHoverBorder : C.optBorder}`,
        borderRadius: '10px',
        padding: '10px 18px',
        color: C.optText,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.16s',
        lineHeight: 1.2,
        boxShadow: hovered
          ? '0 2px 8px rgba(27,50,36,0.10)'
          : '0 1px 3px rgba(27,50,36,0.05)',
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
        {isLoading && <SkeletonBurbuja />}
        <div ref={bottomRef} />
      </div>

      {/* Zona de respuesta */}
      {esperandoRespuesta && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease }}
          style={{ paddingTop: '12px', flexShrink: 0 }}
        >
          {opciones ? (
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
            <div style={{
              display: 'flex',
              gap: '8px',
              background: C.bgCard,
              border: `1.5px solid ${inputFocused ? C.green : C.border}`,
              borderRadius: '14px',
              padding: '4px 4px 4px 16px',
              boxShadow: inputFocused
                ? '0 0 0 3px rgba(27,50,36,0.08)'
                : '0 1px 3px rgba(27,50,36,0.06)',
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
                  color: C.green,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '15px',
                  padding: '11px 0',
                }}
              />
              <motion.button
                whileTap={canSend ? { scale: 0.94 } : {}}
                onClick={handleEnviar}
                disabled={!canSend}
                style={{
                  background: canSend ? C.green : '#E2D9CE',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  color: canSend ? '#FFFFFF' : C.textLight,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'DM Sans', sans-serif",
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
