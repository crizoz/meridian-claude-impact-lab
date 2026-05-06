// StatsCounter — Sección de impacto en números para la página de entrada
//
// Muestra 3 ContadorAnimado en fila: empresas asesoradas, beneficios en MM$, regiones.
// Diseñado para generar confianza social antes de que el usuario empiece el flujo.
//
// Props:
//   empresas:      number — total de empresas asesoradas por Meridian
//   beneficios_mm: number — total de beneficios detectados en millones de pesos
//   regiones:      number — número de regiones de Chile con usuarios
//
// Datos vienen del endpoint /stats via fetch en Entrada.jsx.
// Si el fetch falla, mostrar valores por defecto (ej: 0) sin romper la UI.

import ContadorAnimado from './ContadorAnimado'

export default function StatsCounter({ empresas, beneficios_mm, regiones }) {
  return (
    <div>
      {/* TODO: layout en fila de 3 columnas con separadores */}
      {/* TODO: <ContadorAnimado valor={empresas} sufijo=" empresas asesoradas" /> */}
      {/* TODO: <ContadorAnimado valor={beneficios_mm} prefijo="$" sufijo=" MM en beneficios detectados" /> */}
      {/* TODO: <ContadorAnimado valor={regiones} sufijo=" regiones de Chile" /> */}
    </div>
  )
}
