// PreguntasFlow — UI del flujo conversacional
//
// Props:
//   messages:  [{role: 'user'|'assistant', content: string}]
//   onSend:    (respuesta: string) => void
//   isLoading: boolean — true mientras Claude está procesando

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Paleta Meridian ──────────────────────────────────────────────────────────
const C = {
  accent:       '#F5A623',
  accentDim:    'rgba(245,166,35,0.09)',
  accentBorder: 'rgba(245,166,35,0.22)',
  text:         '#F8F3EB',
  textMid:      'rgba(248,243,235,0.54)',
  userBg:       'rgba(245,166,35,0.10)',
  userBorder:   'rgba(245,166,35,0.24)',
  asstBg:       'rgba(255,248,230,0.05)',
  asstBorder:   'rgba(255,248,230,0.09)',
}

// ─── Avatar de Meridian ───────────────────────────────────────────────────────
function MeridianAvatar() {
  return (
    <div style={{
      width: '30px',
      height: '30px',
      borderRadius: '9px',
      background: 'linear-gradient(145deg, #F5A623 0%, #FBBF24 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginRight: '10px',
      marginTop: '2px',
      boxShadow: '0 0 10px rgba(245,166,35,0.22)',
    }}>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '13px',
        fontWeight: 800,
        color: '#0E0C09',
        letterSpacing: '-0.04em',
        lineHeight: 1,
      }}>
        M
      </span>
    </div>
  )
}

// ─── Burbuja de mensaje ───────────────────────────────────────────────────────
function Mensaje({ role, content }) {
  const isUser = role === 'user'
  const texto = content.replace(/\[OPCIONES:[^\]]+\]/g, '').trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-start',
        marginBottom: '14px',
      }}
    >
      {!isUser && <MeridianAvatar />}
      <div style={{
        maxWidth: '80%',
        background: isUser ? C.userBg : C.asstBg,
        border: `1px solid ${isUser ? C.userBorder : C.asstBorder}`,
        borderRadius: isUser ? '18px 18px 5px 18px' : '5px 18px 18px 18px',
        padding: '13px 17px',
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '15px',
          color: isUser ? C.accent : C.text,
          margin: 0,
          lineHeight: 1.7,
        }}>
          {texto}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Skeleton animado mientras Claude "piensa" ────────────────────────────────
function SkeletonBurbuja() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '14px' }}>
      {/* Avatar pulsante */}
      <motion.div
        animate={{ opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '9px',
          background: 'rgba(245,166,35,0.20)',
          flexShrink: 0,
          marginRight: '10px',
        }}
      />
      {/* Burbuja de texto simulado */}
      <div style={{
        background: C.asstBg,
        border: `1px solid ${C.asstBorder}`,
        borderRadius: '5px 18px 18px 18px',
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '9px',
      }}>
        {[130, 190, 95].map((w, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.10, 0.30, 0.10] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.22 }}
            style={{
              width: `${w}px`,
              height: '12px',
              background: 'rgba(248,243,235,0.14)',
              borderRadius: '6px',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Parser de opciones del marcador [OPCIONES: A | B | C] ───────────────────
function parsearOpciones(content) {
  const match = content.match(/\[OPCIONES:\s*([^\]]+)\]/)
  if (!match) return null
  return match[1].split('|').map(o => o.trim()).filter(Boolean)
}

// ─── Icono enviar (SVG) ───────────────────────────────────────────────────────
function IconSend() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function PreguntasFlow({ messages, onSend, isLoading }) {
  const [inputValor, setInputValor] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll automático al nuevo mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Reenfocar el input cuando Claude responde sin opciones
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading])

  const ultimoAsistente = [...messages].reverse().find(m => m.role === 'assistant')
  const opciones = ultimoAsistente ? parsearOpciones(ultimoAsistente.content) : null
  const esperandoRespuesta = messages.length > 0
    && messages[messages.length - 1].role === 'assistant'
    && !isLoading

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

      {/* Historial de mensajes — scrolleable */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '8px',
        // Ocultar scrollbar visualmente pero mantener funcionalidad
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(245,166,35,0.15) transparent',
      }}>
        {/* initial={false} → los mensajes restaurados desde sessionStorage no animan */}
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <Mensaje key={i} role={m.role} content={m.content} />
          ))}
        </AnimatePresence>
        {isLoading && <SkeletonBurbuja />}
        <div ref={bottomRef} />
      </div>

      {/* Zona de respuesta — visible solo cuando Claude ha terminado de responder */}
      {esperandoRespuesta && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ paddingTop: '14px', flexShrink: 0 }}
        >
          {opciones ? (
            // Opciones predefinidas → botones pill con stagger
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
            // Texto libre → input con icono de envío
            <div style={{
              display: 'flex',
              gap: '8px',
              background: inputFocused
                ? 'rgba(255,248,230,0.05)'
                : 'rgba(255,248,230,0.035)',
              border: `1px solid ${inputFocused
                ? 'rgba(245,166,35,0.30)'
                : 'rgba(255,248,230,0.09)'}`,
              borderRadius: '14px',
              padding: '4px 4px 4px 16px',
              transition: 'border-color 0.2s, background 0.2s',
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
                  padding: '11px 0',
                }}
              />
              <motion.button
                whileHover={canSend ? { scale: 1.05 } : {}}
                whileTap={canSend ? { scale: 0.94 } : {}}
                onClick={handleEnviar}
                disabled={!canSend}
                style={{
                  background: canSend
                    ? 'linear-gradient(145deg, #F5A623, #FBBF24)'
                    : 'rgba(245,166,35,0.09)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  color: canSend ? '#0E0C09' : 'rgba(245,166,35,0.28)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: canSend ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: canSend ? '0 2px 10px rgba(245,166,35,0.28)' : 'none',
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

// ─── Botón de opción individual (separado para mejor lectura) ─────────────────
function OpcionButton({ label, index, onClick, disabled }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.07,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: hovered
          ? 'rgba(245,166,35,0.13)'
          : 'rgba(245,166,35,0.07)',
        border: `1px solid ${hovered
          ? 'rgba(245,166,35,0.35)'
          : 'rgba(245,166,35,0.20)'}`,
        borderRadius: '100px',
        padding: '11px 20px',
        color: C.text,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        lineHeight: 1,
      }}
    >
      {label}
    </motion.button>
  )
}
