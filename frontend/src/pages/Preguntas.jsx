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

const TOTAL_PASOS_ESTIMADOS = 6

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

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
    productos_cmf: (raw.productos_cmf ?? []).map(p => ({
      nombre: p.producto ?? p.nombre ?? '',
      entidad: p.institucion ?? p.entidad ?? '',
      monto_maximo_uf: p.monto_max_uf ?? p.monto_maximo_uf ?? 0,
      tasa_anual_pct: p.tasa_anual_pct ?? 0,
      plazo_max_meses: p.plazo_max_meses ?? null,
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

  // Inicializa la primera pregunta si no hay historial
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

  // paso = número de respuestas del usuario enviadas hasta ahora
  const pasoActual = messages.filter(m => m.role === 'user').length
  const progreso = Math.min(pasoActual / TOTAL_PASOS_ESTIMADOS, 1)

  async function handleSend(respuesta) {
    const nuevosMensajes = [...messages, { role: 'user', content: respuesta }]
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
        try { return !!JSON.parse(data.response ?? '')?.finished } catch { return false }
      })()
      const beneficiosRaw = data.beneficios_json
        ?? (() => { try { return JSON.parse(data.response ?? '')?.beneficios_json } catch { return null } })()

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
        setMessages([...nuevosMensajes, { role: 'assistant', content: textoRespuesta }])
      }
    } catch (err) {
      // TODO: reemplazar console.error por un toast o mensaje de error inline
      console.error('Error al procesar respuesta de Claude:', err)
      // Retroceder al estado anterior para que el usuario pueda reintentar
      setMessages(messages)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      height: '100dvh',
      background: '#0F0E0C',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Fondo decorativo — igual que Entrada.jsx */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse 80% 40% at 50% -5%, rgba(251,191,36,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '560px',
        width: '100%',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}>

        {/* Header: logo + barra de progreso */}
        <div style={{ paddingTop: '24px', paddingBottom: '20px', flexShrink: 0 }}>

          {/* Logo — idéntico al de Entrada.jsx */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: '#FBBF24',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0F0E0C' }} />
            </div>
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '18px', fontWeight: 700,
              color: '#F5F0E8', letterSpacing: '-0.02em',
            }}>
              Meridian
            </span>
          </div>

          {/* Barra de progreso */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                color: 'rgba(245,240,232,0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                Calculando tu perfil
              </span>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '12px', fontWeight: 700,
                color: 'rgba(251,191,36,0.6)',
              }}>
                {pasoActual}/{TOTAL_PASOS_ESTIMADOS}
              </span>
            </div>
            <div style={{
              height: '3px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '100px',
              overflow: 'hidden',
            }}>
              <motion.div
                animate={{ width: `${progreso * 100}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(to right, rgba(251,191,36,0.6), #FBBF24)',
                  borderRadius: '100px',
                  minWidth: progreso > 0 ? '8px' : '0px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Flujo conversacional — ocupa el espacio restante */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <PreguntasFlow
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>

        <div style={{ height: '24px', flexShrink: 0 }} />
      </div>
    </div>
  )
}
