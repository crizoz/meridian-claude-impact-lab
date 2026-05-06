// PreguntasFlow — Contenedor del flujo conversacional de preguntas
//
// Renderiza el historial de mensajes y el input para la respuesta actual.
// Cada nuevo mensaje de Claude entra con animación desde abajo (spring, Framer Motion).
//
// Props:
//   messages:  [{role: "user"|"assistant", content: string}]
//   onSend:    (respuesta: string) => void — callback al enviar una respuesta
//   isLoading: boolean — muestra skeleton/spinner mientras Claude responde
//
// Cuando Claude hace una pregunta con opciones predefinidas (ej: régimen tributario),
// debe renderizar botones en lugar de input de texto libre.
// Detectar si el último mensaje de Claude contiene "[OPCIONES: ...]" u otro marcador.

export default function PreguntasFlow({ messages, onSend, isLoading }) {
  // TODO: ref al final de la lista para hacer scroll automático al nuevo mensaje
  // TODO: state para el valor del input de texto libre
  // TODO: detectar si la última pregunta de Claude tiene opciones predefinidas

  return (
    <div>
      {/* TODO: contenedor scrolleable con historial de mensajes */}
      {/* TODO: animar cada mensaje con motion.div (initial fade+slide, animate visible) */}
      {/* TODO: si isLoading: mostrar skeleton de burbuja de Claude */}
      {/* TODO: si última pregunta tiene opciones: renderizar botones de opción */}
      {/* TODO: si no tiene opciones: renderizar input de texto + botón enviar */}
    </div>
  )
}
