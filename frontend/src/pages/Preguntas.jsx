// Página de preguntas — flujo conversacional con Claude
//
// Muestra una pregunta a la vez (no formulario completo).
// Cada respuesta se envía al backend y Claude decide la siguiente pregunta.
// Al terminar el flujo, Claude retorna finished=true y los beneficios como JSON.
//
// Estado a manejar:
//   messages: [{role, content}] — historial completo para enviar al backend
//   isLoading: boolean — mientras espera respuesta de Claude
//   step: number — para la barra de progreso (estimada, Claude decide el flujo)
//
// Persistencia: guardar messages en sessionStorage para sobrevivir recargas.
// Al obtener finished=true: guardar beneficios_json en sessionStorage y navegar a /resultado.

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PreguntasFlow from '../components/PreguntasFlow'

export default function Preguntas() {
  const navigate = useNavigate()

  // TODO: inicializar messages desde sessionStorage si existe (re-entrada)
  // const [messages, setMessages] = useState(() => JSON.parse(sessionStorage.getItem('messages') || '[]'))
  // const [isLoading, setIsLoading] = useState(false)

  // TODO: función para enviar respuesta al backend y procesar la de Claude
  // async function handleSend(respuesta) {
  //   const newMessages = [...messages, { role: 'user', content: respuesta }]
  //   setMessages(newMessages)
  //   setIsLoading(true)
  //   const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages: newMessages, mode: 'web' }) })
  //   const data = await res.json()
  //   if (data.finished) {
  //     sessionStorage.setItem('beneficios', JSON.stringify(data.beneficios_json))
  //     navigate('/resultado')
  //   } else {
  //     setMessages([...newMessages, { role: 'assistant', content: data.response }])
  //   }
  //   setIsLoading(false)
  // }

  return (
    <div>
      {/* TODO: barra de progreso (paso estimado de 6) */}
      {/* TODO: <PreguntasFlow messages={messages} onSend={handleSend} isLoading={isLoading} /> */}
    </div>
  )
}
