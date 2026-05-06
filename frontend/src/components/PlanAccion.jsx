// PlanAccion — Lista de pasos concretos para acceder a los beneficios detectados
//
// Muestra una lista numerada de acciones ordenadas por urgencia/impacto,
// con checkbox interactivo para que el usuario marque su progreso.
//
// Props:
//   pasos: [{
//     numero:        number,
//     accion:        string — descripción de la acción concreta,
//     responsable:   string — "Tú" | "Tu contador" | "BancoEstado" | etc.,
//     plazo:         string — "Esta semana" | "Este mes" | etc.,
//     link_recurso:  string | null — URL al recurso si aplica
//   }]
//
// Animación: entrada escalonada de cada paso (staggerChildren en Framer Motion)
// Persistir los checkboxes completados en localStorage

export default function PlanAccion({ pasos }) {
  // TODO: state para checkboxes completados (inicializar desde localStorage)
  // TODO: guardar en localStorage cada vez que se marca/desmarca un paso

  return (
    <div>
      {/* TODO: título "Tu plan de acción" */}
      {/* TODO: motion.ul con staggerChildren para entrada escalonada */}
      {/* TODO: por cada paso: número + checkbox + acción + responsable + plazo + link */}
      {/* TODO: botón "Descargar plan como PDF" (usar window.print() o librería jsPDF) */}
    </div>
  )
}
