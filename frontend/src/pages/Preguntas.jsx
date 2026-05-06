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
//     total_estimado: number,                  // suma de monto_estimado de todos los beneficios
//     beneficios: {
//       nombre: string,
//       descripcion: string,
//       monto_estimado: number,
//       tipo: 'tributario' | 'financiero' | 'subsidio'
//     }[],
//     productos_cmf: {
//       nombre: string,
//       entidad: string,
//       monto_maximo: number,
//       tasa_estimada: string
//     }[],
//     plan_accion: {
//       paso: number,
//       descripcion: string,
//       tiempo_estimado: string,
//       urgencia: 'alta' | 'media' | 'baja'
//     }[]
//   }
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_PASOS_ESTIMADOS = 6   // Claude puede variar; esto es solo para la barra visual

// Preguntas que el mock envía como "respuesta de Claude" a cada paso del usuario.
// Index 0 = respuesta tras la 1ª respuesta del usuario, index 1 tras la 2ª, etc.
const FLUJO_PREGUNTAS_MOCK = [
  "Entendido. ¿Cuál es el ingreso mensual aproximado de tu negocio? [OPCIONES: Menos de $500.000 | $500.000 a $2.000.000 | $2.000.000 a $5.000.000 | Más de $5.000.000]",
  "¿En qué región de Chile opera tu negocio principalmente? [OPCIONES: Metropolitana | Valparaíso | Biobío | Otra región]",
  "¿Cuántas personas trabajan contigo en el negocio? [OPCIONES: Solo yo | 2 a 5 personas | Más de 5 personas]",
  "¿Actualmente tienes iniciación de actividades en el SII o solo operas con tu RUT personal? [OPCIONES: Solo RUT personal | Tengo iniciación de actividades | Tengo empresa formal (SpA o Ltda.)]",
  "Último dato. ¿Tienes cargas familiares o deudas financieras activas? [OPCIONES: Tengo cargas familiares | Tengo deudas activas | Ambas | Ninguna de las anteriores]",
  // Después de FLUJO_PREGUNTAS_MOCK.length respuestas → mockRespuesta retorna finished=true
]

// Datos de ejemplo para la página de resultados.
// Reemplazar por la respuesta real del backend (misma estructura).
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
    {
      nombre: 'Crédito Pyme Express',
      entidad: 'Banco Estado',
      monto_maximo: 20000000,
      tasa_estimada: '0,5% mensual',
    },
    {
      nombre: 'Capital de Trabajo Fogape',
      entidad: 'Banco de Chile',
      monto_maximo: 10000000,
      tasa_estimada: '0,7% mensual',
    },
  ],
  plan_accion: [
    { paso: 1, descripcion: 'Inicia actividades en el SII en línea (20 min, gratis)', tiempo_estimado: 'Esta semana', urgencia: 'alta' },
    { paso: 2, descripcion: 'Solicita Clave Empresas en el SII para gestionar tu RUT tributario', tiempo_estimado: 'Esta semana', urgencia: 'alta' },
    { paso: 3, descripcion: 'Postula al subsidio de capital de trabajo en sercotec.cl', tiempo_estimado: 'Este mes', urgencia: 'media' },
    { paso: 4, descripcion: 'Presenta tu carpeta tributaria en Banco Estado para evaluar crédito Pyme Express', tiempo_estimado: 'Este mes', urgencia: 'media' },
  ],
}

// Simula la llamada a /api/chat con delay realista (600–1000 ms).
// Recibe el array completo de messages (ya incluye el nuevo mensaje del usuario).
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
      // ── MODO MOCK ─────────────────────────────────────────────────────────
      // Borrar este bloque al conectar el backend real
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
