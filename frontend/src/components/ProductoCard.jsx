// ProductoCard — Tarjeta de un producto financiero regulado (datos de CMF)
//
// Muestra institución, nombre del producto, monto máximo, tasa y plazo.
// Incluye un botón que lleva al sitio oficial de la institución.
//
// Props:
//   institucion:      string — nombre del banco o cooperativa
//   producto:         string — nombre del producto financiero
//   monto_max_uf:     number — monto máximo en UF
//   tasa_anual_pct:   number — tasa de interés anual referencial
//   plazo_max_meses:  number — plazo máximo en meses
//   link:             string — URL al sitio oficial del producto
//
// Animación: hover con scale(1.02) y sombra más pronunciada (Framer Motion whileHover)
// Aclaración: mostrar "Tasa referencial — verificar condiciones actuales" bajo la tasa

export default function ProductoCard({ institucion, producto, monto_max_uf, tasa_anual_pct, plazo_max_meses, link }) {
  // TODO: formatear monto_max_uf con 2 decimales y "UF" label

  return (
    <div>
      {/* TODO: header con nombre de institución (y logo si está disponible) */}
      {/* TODO: nombre del producto */}
      {/* TODO: fila de stats: monto_max_uf | tasa_anual_pct% | plazo_max_meses meses */}
      {/* TODO: nota de "tasa referencial" */}
      {/* TODO: botón CTA que abre link en nueva pestaña */}
    </div>
  )
}
