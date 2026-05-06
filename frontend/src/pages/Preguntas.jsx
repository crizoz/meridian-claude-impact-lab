// Preguntas — flujo conversacional basado en referencia Meridian.zip

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PreguntasFlow from '../components/PreguntasFlow'

// ─────────────────────────────────────────────────────────────────────────────
// MOCK BACKEND
//
// PARA CONECTAR EL BACKEND REAL:
//   1. Borrar FLUJO_PREGUNTAS_MOCK, BENEFICIOS_MOCK y mockRespuesta
//   2. En handleSend: borrar bloque MOCK y descomentar bloque REAL
//
// Contrato:
//   POST ${VITE_API_URL}/chat
//   Body:     { messages: [{role, content}], mode: 'web' }
//   Response: { response?, finished, beneficios_json? }
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_PASOS = 6

const ETAPAS = [
  'Tu negocio',
  'Ingresos',
  'Ubicación',
  'Tu equipo',
  'Situación tributaria',
  'Últimos detalles',
]

const FLUJO_PREGUNTAS_MOCK = [
  "Entendido. ¿Cuál es el ingreso mensual aproximado de tu negocio? [OPCIONES: Menos de $500.000 | $500.000 a $2.000.000 | $2.000.000 a $5.000.000 | Más de $5.000.000]",
  "¿En qué región de Chile opera tu negocio principalmente? [OPCIONES: Metropolitana | Valparaíso | Biobío | Otra región]",
  "¿Cuántas personas trabajan contigo en el negocio? [OPCIONES: Solo yo | 2 a 5 personas | Más de 5 personas]",
  "¿Actualmente tienes iniciación de actividades en el SII o solo operas con tu RUT personal? [OPCIONES: Solo RUT personal | Tengo iniciación de actividades | Tengo empresa formal (SpA o Ltda.)]",
  "Último dato. ¿Tienes cargas familiares o deudas financieras activas? [OPCIONES: Tengo cargas familiares | Tengo deudas activas | Ambas | Ninguna de las anteriores]",
]

const BENEFICIOS_MOCK = {
  total_estimado: 3240000,
  beneficios: [
    { nombre: 'Régimen Pro Pyme (14 D)', descripcion: 'Tributación simplificada sobre flujo de caja.', monto_estimado: 1200000, tipo: 'tributario' },
    { nombre: 'Crédito Fogape Reactiva', descripcion: 'Garantía estatal del 80% para acceder a crédito bancario a tasa preferencial.', monto_estimado: 8000000, tipo: 'financiero' },
    { nombre: 'Subsidio Capital de Trabajo Sercotec', descripcion: 'Subsidio no reembolsable de hasta $2.000.000.', monto_estimado: 2000000, tipo: 'subsidio' },
    { nombre: 'Deducción de gastos tributarios', descripcion: 'Deduce hasta el 100% de tus gastos de operación.', monto_estimado: 640000, tipo: 'tributario' },
  ],
  productos_cmf: [
    { nombre: 'Crédito Pyme Express', entidad: 'Banco Estado', monto_maximo: 20000000, tasa_estimada: '0,5% mensual' },
    { nombre: 'Capital de Trabajo Fogape', entidad: 'Banco de Chile', monto_maximo: 10000000, tasa_estimada: '0,7% mensual' },
  ],
  plan_accion: [
    { paso: 1, descripcion: 'Inicia actividades en el SII en línea (20 min, gratis)', tiempo_estimado: 'Esta semana', urgencia: 'alta' },
    { paso: 2, descripcion: 'Solicita Clave Empresas en el SII', tiempo_estimado: 'Esta semana', urgencia: 'alta' },
    { paso: 3, descripcion: 'Postula al subsidio de capital de trabajo en sercotec.cl', tiempo_estimado: 'Este mes', urgencia: 'media' },
    { paso: 4, descripcion: 'Presenta tu carpeta tributaria en Banco Estado', tiempo_estimado: 'Este mes', urgencia: 'media' },
  ],
}

function mockRespuesta(mensajes) {
  const paso = mensajes.filter(m => m.role === 'user').length
  return new Promise(resolve =>
    setTimeout(() => {
      if (paso > FLUJO_PREGUNTAS_MOCK.length) {
        resolve({ finished: true, beneficios_json: BENEFICIOS_MOCK })
      } else {
        resolve({ finished: false, response: FLUJO_PREGUNTAS_MOCK[paso - 1] })
      }
    }, 600 + Math.random() * 400)
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function mensajeInicial(dolor) {
  const intros = {
    credito_rechazado:
      'Hola, soy Meridian. Me contaste que no puedes acceder a créditos. Vamos a entender tu situación para mostrarte exactamente qué alternativas existen para ti. ¿Hace cuánto tiempo tienes tu negocio? [OPCIONES: Menos de 1 año | 1 a 3 años | Más de 3 años]',
    necesito_boleta:
      'Hola, soy Meridian. Entiendo que los impuestos te generan dudas. Vamos a aclarar tu situación fiscal y mostrarte el camino más simple hacia la tranquilidad. ¿Hace cuánto tiempo llevas en este negocio? [OPCIONES: Menos de 1 año | 1 a 3 años | Más de 3 años]',
    quiero_crecer:
      'Hola, soy Meridian. Quieres hacer crecer tu negocio — genial. Vamos a encontrar las herramientas del Estado que te corresponden. ¿Hace cuánto tiempo tienes tu negocio? [OPCIONES: Menos de 1 año | 1 a 3 años | Más de 3 años]',
  }
  return intros[dolor] ?? intros.quiero_crecer
}

// ─── Tokens de color ──────────────────────────────────────────────────────────
const C = {
  bg:       '#F8F4ED',
  bgCard:   '#EDEAE3',
  ink:      '#1A1A1A',
  inkMid:   '#4A4A48',
  inkSoft:  '#76756F',
  line:     '#DCD8CF',
  lineSoft: '#E8E5DC',
  accent:   '#0F3D2E',
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

// ─── Página de preguntas ──────────────────────────────────────────────────────
export default function Preguntas() {
  const navigate = useNavigate()

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

  useEffect(() => {
    const ultimo = messages[messages.length - 1]
    if (messages.length > 0 && ultimo?.role === 'assistant') {
      sessionStorage.setItem('meridian_messages', JSON.stringify(messages))
    }
  }, [messages])

  const pasoActual = messages.filter(m => m.role === 'user').length
  const etapa = pasoActual < ETAPAS.length ? ETAPAS[pasoActual] : 'Finalizando…'
  const stepLabel = `${String(pasoActual + 1).padStart(2, '0')} / ${String(TOTAL_PASOS).padStart(2, '0')}`

  async function handleSend(respuesta) {
    const nuevosMensajes = [...messages, { role: 'user', content: respuesta }]
    setMessages(nuevosMensajes)
    setIsLoading(true)

    try {
      // ── MODO MOCK ──────────────────────────────────────────────────────────
      const data = await mockRespuesta(nuevosMensajes)
      // ── FIN MODO MOCK ──────────────────────────────────────────────────────

      // ── MODO REAL (descomentar al conectar el backend) ─────────────────────
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ messages: nuevosMensajes, mode: 'web' }),
      // })
      // if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`)
      // const data = await res.json()
      // ── FIN MODO REAL ──────────────────────────────────────────────────────

      if (data.finished) {
        sessionStorage.setItem('meridian_beneficios', JSON.stringify(data.beneficios_json))
        sessionStorage.removeItem('meridian_messages')
        navigate('/resultado')
      } else {
        setMessages([...nuevosMensajes, { role: 'assistant', content: data.response }])
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
            {/* Botón volver — transparente como en la referencia */}
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

            {/* Logo centrado */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/Logo.png" alt="Meridian" width={22} height={22}
                style={{ objectFit: 'contain' }} />
              <span style={{
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontSize: 14, fontWeight: 800,
                color: C.ink, letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}>
                Meridian
              </span>
            </div>

            {/* Contador en monospace */}
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
                animate={{ width: `${(Math.min(pasoActual, TOTAL_PASOS) / TOTAL_PASOS) * 100}%` }}
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
