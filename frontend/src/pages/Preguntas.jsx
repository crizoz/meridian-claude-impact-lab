// frontend/src/pages/Preguntas.jsx
// Flujo conversacional — Meridian le hace preguntas al usuario una por vez.
//
// Flujo:
//   1. Lee `meridian_dolor` de sessionStorage (guardado en Entrada.jsx)
//   2. Inicializa la primera pregunta de Claude según ese dolor
//   3. Cada respuesta del usuario se envía al backend POST /chat
//   4. Claude responde con la siguiente pregunta
//   5. Al terminar (finished=true) normaliza beneficios_json y navega a /resultado

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PreguntasFlow from '../components/PreguntasFlow'

const TOTAL_PASOS = 6

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const ETAPAS = [
  'Tu negocio',
  'Ingresos',
  'Ubicación',
  'Tu equipo',
  'Situación tributaria',
  'Últimos detalles',
]

// ─── Tokens de color ──────────────────────────────────────────────────────────
const C = {
  bg: '#F8F4ED',
  bgCard: '#EDEAE3',
  ink: '#1A1A1A',
  inkMid: '#4A4A48',
  inkSoft: '#76756F',
  line: '#DCD8CF',
  lineSoft: '#E8E5DC',
  accent: '#0F3D2E',
}

// Mapea la urgencia según la posición del paso (el backend no la envía)
function urgenciaPorPaso(index) {
  if (index < 2) return 'alta'
  if (index < 4) return 'media'
  return 'baja'
}

// Normaliza el beneficios_json del backend al formato que esperan los componentes.
// Claude puede usar nombres de campo distintos según el turno de conversación.
function normalizarBeneficios(raw) {
  return {
    total_estimado: raw.diferencia_anual_pesos ?? raw.total_estimado ?? 0,
    beneficios: (raw.beneficios ?? []).map(b => ({
      tipo: b.tipo === 'estatal' ? 'subsidio' : b.tipo,
      nombre: b.titulo ?? b.nombre ?? '',
      descripcion: b.descripcion ?? '',
      monto_estimado: b.monto_estimado ?? 0,
    })),
    productos_cmf: (raw.productos_cmf ?? raw.creditos_cmf ?? []).map(p => ({
      nombre: p.producto ?? p.nombre ?? '',
      entidad: p.institucion ?? p.entidad ?? '',
      monto_maximo_uf: p.monto_max_uf ?? p.monto_maximo_uf ?? 0,
      // El tool devuelve 'tasa' como string ("22.0%"), Claude puede devolver 'tasa_anual_pct' como número
      tasa_anual_pct: p.tasa_anual_pct ?? parseFloat(p.tasa ?? '0') ?? 0,
      // El tool devuelve 'plazo_meses', Claude puede devolver 'plazo_max_meses'
      plazo_max_meses: p.plazo_max_meses ?? p.plazo_meses ?? null,
      link: p.link ?? '',
    })),
    plan_accion: (raw.plan_accion ?? []).map((p, i) => ({
      paso: p.numero ?? p.paso ?? i + 1,
      descripcion: p.accion ?? p.descripcion ?? '',
      tiempo_estimado: p.plazo ?? p.tiempo_estimado ?? '',
      urgencia: p.urgencia ?? urgenciaPorPaso(i),
      link_recurso: p.link_recurso ?? null,
    })),
  }
}

// Primer mensaje de Claude, personalizado según el punto de dolor de Entrada.jsx.
// El marcador [OPCIONES: ...] hace que PreguntasFlow renderice botones.
function mensajeInicial(dolor) {
  const intros = {
    credito_rechazado:
      'Hola, soy Meridian. Me contaste que te rechazaron un crédito. Antes de mostrarte cuánto dinero estás dejando sobre la mesa, necesito entender tu situación. ¿Hace cuánto tiempo tienes tu negocio? [OPCIONES: Menos de 1 año | 1 a 3 años | Más de 3 años]',
    necesito_boleta:
      'Hola, soy Meridian. Entiendo que te pidieron una boleta y no puedes emitirla. Vamos a ver cuánto te cuesta no estar formalizado. ¿Hace cuánto tiempo llevas en este trabajo? [OPCIONES: Menos de 1 año | 1 a 3 años | Más de 3 años]',
    quiero_crecer:
      'Hola, soy Meridian. Hay beneficios del Estado que tu negocio aún no está usando. Vamos a calcular exactamente cuáles son. ¿Hace cuánto tiempo tienes tu negocio? [OPCIONES: Menos de 1 año | 1 a 3 años | Más de 3 años]',
  }
  return intros[dolor] ?? intros.quiero_crecer
}

// ─── Icono atrás ──────────────────────────────────────────────────────────────
function IconBack() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export default function Preguntas() {
  const navigate = useNavigate()

  // Restaura el historial de sessionStorage para sobrevivir recargas.
  // Solo persiste cuando el último mensaje es del asistente (estado "limpio"),
  // así una recarga durante el envío vuelve a la última pregunta de Claude.
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('meridian_messages')
    return saved ? JSON.parse(saved) : []
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (messages.length === 0) {
      const dolor = sessionStorage.getItem('meridian_dolor') ?? 'quiero_crecer'
      setMessages([{ role: 'assistant', content: mensajeInicial(dolor) }])
    }
  }, [])

  // Persiste solo cuando el último mensaje es del asistente
  useEffect(() => {
    const ultimo = messages[messages.length - 1]
    if (messages.length > 0 && ultimo?.role === 'assistant') {
      sessionStorage.setItem('meridian_messages', JSON.stringify(messages))
    }
  }, [messages])

  const pasoActual = messages.filter(m => m.role === 'user').length
  const etapa = pasoActual < ETAPAS.length ? ETAPAS[pasoActual] : 'Finalizando…'
  const stepLabel = `Pregunta ${String(pasoActual + 1).padStart(2, '0')}`

  function handleSend(respuesta) {
    handleSendRaw(respuesta, messages)
  }

  async function handleSendRaw(respuesta, baseMessages) {
    const nuevosMensajes = [...baseMessages, { role: 'user', content: respuesta }]
    setMessages(nuevosMensajes)
    setIsLoading(true)

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nuevosMensajes, mode: 'web' }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`)
      const data = await res.json()

      // El backend puede devolver finished:true directamente, o bien devolver
      // finished:false con el JSON completo en data.response (bug edge case).
      const isFinished = data.finished || (() => {
        try {
          const parsed = JSON.parse(data.response ?? '')
          return !!parsed?.finished || !!parsed?.beneficios_json || !!parsed?.plan_accion || !!parsed?.productos_cmf || !!parsed?.beneficios
        } catch { return false }
      })()
      const beneficiosRaw = data.beneficios_json
        ?? (() => {
          try {
            const parsed = JSON.parse(data.response ?? '')
            return parsed?.beneficios_json ?? parsed
          } catch { return null }
        })()

      if (isFinished) {
        const beneficios = normalizarBeneficios(beneficiosRaw ?? {})
        sessionStorage.setItem('meridian_beneficios', JSON.stringify(beneficios))
        sessionStorage.removeItem('meridian_messages')
        navigate('/resultado')
      } else {
        // Mostrar solo el texto de la pregunta, no el JSON completo
        const textoRespuesta = (() => {
          try { return JSON.parse(data.response ?? '')?.response ?? data.response }
          catch { return data.response }
        })()
        const mensajesActualizados = [...nuevosMensajes, { role: 'assistant', content: textoRespuesta }]
        setMessages(mensajesActualizados)

        // Si Claude manda un mensaje de transición ("voy a calcular...") sin pregunta ni
        // opciones, re-disparamos automáticamente para no dejar al usuario colgado.
        const esTransicion = textoRespuesta &&
          !textoRespuesta.includes('?') &&
          !textoRespuesta.includes('[OPCIONES:')
        if (esTransicion) {
          setTimeout(() => handleSendRaw('continúa', mensajesActualizados), 300)
        }
      }
    } catch (err) {
      console.error('Error al procesar respuesta de Claude:', err)
      setMessages(messages)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      height: '100dvh',
      background: C.bg,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        margin: '0 auto',
        padding: '0 22px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>

        {/* ── Header ── */}
        <header style={{ flexShrink: 0, paddingTop: '18px', paddingBottom: '14px' }}>

          {/* Fila: volver · logo centrado · contador */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: 'none',
                padding: '4px 0',
                cursor: 'pointer',
                color: C.inkMid,
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontSize: 13, fontWeight: 500,
              }}
            >
              <IconBack />
              Volver
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/Logo.svg" alt="Meridian"
                style={{ height: 28, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
              <span style={{
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontSize: 14, fontWeight: 800,
                color: C.ink, letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}>
                Meridian
              </span>
            </div>

            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, fontWeight: 400,
              color: C.inkSoft,
              letterSpacing: '0.04em',
            }}>
              {stepLabel}
            </div>
          </div>

          {/* Progreso: etiqueta de etapa + barra única */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: C.accent,
              minWidth: 110, flexShrink: 0,
            }}>
              {etapa}
            </div>
            <div style={{
              flex: 1, height: 3,
              background: C.lineSoft,
              borderRadius: 100,
              overflow: 'hidden',
            }}>
              <motion.div
                animate={{ width: `${Math.min((pasoActual + 1) * 14, 95)}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  background: C.accent,
                  borderRadius: 100,
                }}
              />
            </div>
          </div>
        </header>

        {/* ── Conversación ── */}
        <div style={{
          flex: 1, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          paddingTop: '12px',
        }}>
          <PreguntasFlow
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>

        <div style={{ height: '20px', flexShrink: 0 }} />
      </div>
    </div>
  )
}
