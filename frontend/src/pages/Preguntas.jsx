// frontend/src/pages/Preguntas.jsx
// Flujo conversacional — Meridian le hace preguntas al usuario una por vez.
//
// Flujo:
//   1. Lee `meridian_dolor` de sessionStorage (guardado en Entrada.jsx)
//   2. Inicializa la primera pregunta de Claude según ese dolor
//   3. Cada respuesta del usuario se envía al backend (o al mock)
//   4. Claude responde con la siguiente pregunta
//   5. Al terminar (finished=true) guarda beneficios_json y navega a /resultado

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PreguntasFlow from '../components/PreguntasFlow'

// ─────────────────────────────────────────────────────────────────────────────
// MOCK BACKEND
// Simula las respuestas de Claude durante el desarrollo local.
//
// PARA CONECTAR EL BACKEND REAL:
//   1. Borrar las constantes FLUJO_PREGUNTAS_MOCK y BENEFICIOS_MOCK
//   2. Borrar la función mockRespuesta
//   3. En handleSend: borrar el bloque "── MODO MOCK ──" y descomentar "── MODO REAL ──"
//
// Contrato esperado del backend:
//   POST ${VITE_API_URL}/chat
//   Body:     { messages: [{role: 'user'|'assistant', content: string}], mode: 'web' }
//   Response: { response?: string, finished: boolean, beneficios_json?: BeneficiosJSON }
//
// Tipo BeneficiosJSON:
//   {
//     total_estimado: number,
//     beneficios: { nombre, descripcion, monto_estimado, tipo }[],
//     productos_cmf: { nombre, entidad, monto_maximo, tasa_estimada }[],
//     plan_accion: { paso, descripcion, tiempo_estimado, urgencia }[]
//   }
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_PASOS_ESTIMADOS = 6

// Etiquetas de etapa para hacer el progreso más humano
const ETIQUETAS_PASO = [
  'Conociendo tu negocio',
  'Tus ingresos',
  'Tu ubicación',
  'Tu equipo',
  'Tu situación tributaria',
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
    {
      nombre: 'Régimen Pro Pyme (14 D)',
      descripcion: 'Tributación simplificada sobre flujo de caja. Pagas impuestos solo cuando cobras, no cuando facturas.',
      monto_estimado: 1200000,
      tipo: 'tributario',
    },
    {
      nombre: 'Crédito Fogape Reactiva',
      descripcion: 'Garantía estatal del 80% para acceder a crédito bancario a tasa preferencial.',
      monto_estimado: 8000000,
      tipo: 'financiero',
    },
    {
      nombre: 'Subsidio Capital de Trabajo Sercotec',
      descripcion: 'Subsidio no reembolsable de hasta $2.000.000 para micro y pequeñas empresas.',
      monto_estimado: 2000000,
      tipo: 'subsidio',
    },
    {
      nombre: 'Deducción de gastos tributarios',
      descripcion: 'Al formalizar puedes deducir hasta el 100% de tus gastos de operación (arriendos, honorarios, insumos).',
      monto_estimado: 640000,
      tipo: 'tributario',
    },
  ],
  productos_cmf: [
    { nombre: 'Crédito Pyme Express', entidad: 'Banco Estado', monto_maximo: 20000000, tasa_estimada: '0,5% mensual' },
    { nombre: 'Capital de Trabajo Fogape', entidad: 'Banco de Chile', monto_maximo: 10000000, tasa_estimada: '0,7% mensual' },
  ],
  plan_accion: [
    { paso: 1, descripcion: 'Inicia actividades en el SII en línea (20 min, gratis)', tiempo_estimado: 'Esta semana', urgencia: 'alta' },
    { paso: 2, descripcion: 'Solicita Clave Empresas en el SII para gestionar tu RUT tributario', tiempo_estimado: 'Esta semana', urgencia: 'alta' },
    { paso: 3, descripcion: 'Postula al subsidio de capital de trabajo en sercotec.cl', tiempo_estimado: 'Este mes', urgencia: 'media' },
    { paso: 4, descripcion: 'Presenta tu carpeta tributaria en Banco Estado para evaluar crédito Pyme Express', tiempo_estimado: 'Este mes', urgencia: 'media' },
  ],
}

function mockRespuesta(mensajes) {
  const pasoUsuario = mensajes.filter(m => m.role === 'user').length
  return new Promise(resolve => {
    setTimeout(() => {
      if (pasoUsuario > FLUJO_PREGUNTAS_MOCK.length) {
        resolve({ finished: true, beneficios_json: BENEFICIOS_MOCK })
      } else {
        resolve({ finished: false, response: FLUJO_PREGUNTAS_MOCK[pasoUsuario - 1] })
      }
    }, 600 + Math.random() * 400)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// FIN MOCK BACKEND
// ─────────────────────────────────────────────────────────────────────────────

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

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg:         '#0E0C09',
  accent:     '#F5A623',
  accentFaint:'rgba(245,166,35,0.55)',
  text:       '#F8F3EB',
  textFaint:  'rgba(248,243,235,0.28)',
}

// ─── Icono SVG de flecha atrás ────────────────────────────────────────────────
function IconBack() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

// ─── Logo Meridian (inline, igual que Entrada.jsx) ────────────────────────────
function MeridianLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '9px',
        background: 'linear-gradient(145deg, #F5A623 0%, #FBBF24 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 14px rgba(245,166,35,0.24)',
        flexShrink: 0,
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
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '16px',
        fontWeight: 700,
        color: C.text,
        letterSpacing: '-0.025em',
      }}>
        Meridian
      </span>
    </div>
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

  const pasoActual = messages.filter(m => m.role === 'user').length
  const progreso = Math.min(pasoActual / TOTAL_PASOS_ESTIMADOS, 1)
  const etiquetaPaso = ETIQUETAS_PASO[pasoActual] ?? 'Finalizando…'

  async function handleSend(respuesta) {
    const nuevosMensajes = [...messages, { role: 'user', content: respuesta }]
    setMessages(nuevosMensajes)
    setIsLoading(true)

    try {
      // ── MODO MOCK ─────────────────────────────────────────────────────────
      const data = await mockRespuesta(nuevosMensajes)
      // ── FIN MODO MOCK ─────────────────────────────────────────────────────

      // ── MODO REAL (descomentar al conectar el backend) ────────────────────
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ messages: nuevosMensajes, mode: 'web' }),
      // })
      // if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`)
      // const data = await res.json()
      // ── FIN MODO REAL ─────────────────────────────────────────────────────

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
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Fondos ambientales cálidos */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: [
          'radial-gradient(ellipse 80% 50% at 10% -20%, rgba(245,130,15,0.14) 0%, transparent 58%)',
          'radial-gradient(ellipse 60% 40% at 90% 105%, rgba(190,100,10,0.08) 0%, transparent 50%)',
        ].join(', '),
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

        {/* Header: navegación + logo + progreso */}
        <div style={{ paddingTop: '22px', paddingBottom: '18px', flexShrink: 0 }}>

          {/* Fila superior: botón volver + logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: C.textFaint,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                padding: '6px 0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.text}
              onMouseLeave={e => e.currentTarget.style.color = C.textFaint}
            >
              <IconBack />
              <span>Volver</span>
            </button>

            <MeridianLogo />
          </div>

          {/* Barra de progreso con etiqueta de etapa */}
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
                color: C.textFaint,
                letterSpacing: '0.01em',
              }}>
                {pasoActual > 0 ? etiquetaPaso : 'Comenzando tu perfil…'}
              </span>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '12px',
                fontWeight: 700,
                color: C.accentFaint,
              }}>
                {pasoActual}/{TOTAL_PASOS_ESTIMADOS}
              </span>
            </div>

            {/* Barra de progreso animada */}
            <div style={{
              height: '3px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '100px',
              overflow: 'hidden',
            }}>
              <motion.div
                animate={{ width: `${progreso * 100}%` }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(to right, rgba(245,166,35,0.55), #F5A623)',
                  borderRadius: '100px',
                  minWidth: progreso > 0 ? '10px' : '0px',
                  boxShadow: progreso > 0 ? '0 0 8px rgba(245,166,35,0.4)' : 'none',
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
