// PreguntasFlow — UI del flujo conversacional
//
// Props:
//   messages:  [{role: 'user'|'assistant', content: string}]
//   onSend:    (respuesta: string) => void
//   isLoading: boolean — true mientras Claude está procesando
//
// Detección de opciones: si el último mensaje del asistente contiene
// [OPCIONES: A | B | C], renderiza botones en lugar de input de texto libre.

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Burbuja de mensaje individual
function Mensaje({ role, content }) {
  const isUser = role === 'user'
  // Eliminar el marcador [OPCIONES: ...] del texto visible
  const texto = content.replace(/\[OPCIONES:[^\]]+\]/g, '').trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}
    >
      {!isUser && (
        // Avatar Meridian — igual al logo de Entrada.jsx
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: '#FBBF24', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: '10px', marginTop: '2px',
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0F0E0C' }} />
        </div>
      )}
      <div style={{
        maxWidth: '78%',
        background: isUser ? 'rgba(251,191,36,0.10)' : 'rgba(255,255,255,0.05)',
        border: isUser ? '1px solid rgba(251,191,36,0.22)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
        padding: '12px 16px',
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '15px',
          color: isUser ? '#FBBF24' : '#F5F0E8',
          margin: 0,
          lineHeight: 1.65,
        }}>
          {texto}
        </p>
      </div>
    </motion.div>
  )
}

// Skeleton animado mientras Claude "piensa"
function SkeletonBurbuja() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px',
        background: 'rgba(251,191,36,0.2)', flexShrink: 0, marginRight: '10px',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '6px' }}>
        {[100, 160, 80].map((w, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18 }}
            style={{
              width: `${w}px`, height: '13px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '6px',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Extrae las opciones del marcador [OPCIONES: A | B | C] → ['A', 'B', 'C'] o null
function parsearOpciones(content) {
  const match = content.match(/\[OPCIONES:\s*([^\]]+)\]/)
  if (!match) return null
  return match[1].split('|').map(o => o.trim()).filter(Boolean)
}

export default function PreguntasFlow({ messages, onSend, isLoading }) {
  const [inputValor, setInputValor] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll automático al nuevo mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Reenfocar el input de texto cuando Claude responde sin opciones
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Historial de mensajes — scrolleable */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '8px' }}>
        {/* initial={false} → los mensajes restaurados desde sessionStorage no animan */}
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <Mensaje key={i} role={m.role} content={m.content} />
          ))}
        </AnimatePresence>
        {isLoading && <SkeletonBurbuja />}
        <div ref={bottomRef} />
      </div>

      {/* Zona de respuesta — solo visible cuando Claude acaba de responder */}
      {esperandoRespuesta && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ paddingTop: '12px', flexShrink: 0 }}
        >
          {opciones ? (
            // Opciones predefinidas → pill buttons
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {opciones.map((op, i) => (
                <motion.button
                  key={op}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ scale: 1.03, background: 'rgba(251,191,36,0.14)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSend(op)}
                  disabled={isLoading}
                  style={{
                    background: 'rgba(251,191,36,0.06)',
                    border: '1px solid rgba(251,191,36,0.22)',
                    borderRadius: '100px',
                    padding: '10px 18px',
                    color: '#F5F0E8',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {op}
                </motion.button>
              ))}
            </div>
          ) : (
            // Texto libre → input + botón enviar
            <div style={{
              display: 'flex',
              gap: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '12px',
              padding: '4px 4px 4px 16px',
            }}>
              <input
                ref={inputRef}
                value={inputValor}
                onChange={e => setInputValor(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu respuesta…"
                className="meridian-input"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F5F0E8',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '15px',
                  padding: '10px 0',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleEnviar}
                disabled={!inputValor.trim() || isLoading}
                style={{
                  background: inputValor.trim() ? '#FBBF24' : 'rgba(251,191,36,0.12)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  color: inputValor.trim() ? '#0F0E0C' : 'rgba(251,191,36,0.3)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: inputValor.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                Enviar →
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
