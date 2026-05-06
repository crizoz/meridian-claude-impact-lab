// Página de resultados — muestra los beneficios detectados por Claude
//
// Recibe el JSON de beneficios desde sessionStorage (guardado en Preguntas.jsx).
// Si no hay datos, redirige a /preguntas para no mostrar página vacía.
//
// Secciones a implementar:
// 1. ContadorAnimado con el total de ahorro/beneficios detectados
// 2. BeneficioCards para cada beneficio tributario y financiero
// 3. ProductoCards con los productos CMF disponibles para el perfil
// 4. PlanAccion con los pasos concretos ordenados
// 5. Botón "Descargar reporte PDF"
// 6. Botón "Continuar en WhatsApp" (link a wa.me con número de Twilio)
//
// Animaciones: entrada escalonada de todas las cards con Framer Motion staggerChildren

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ContadorAnimado from '../components/ContadorAnimado'
import BeneficioCard from '../components/BeneficioCard'
import ProductoCard from '../components/ProductoCard'
import PlanAccion from '../components/PlanAccion'

export default function Resultado() {
  const navigate = useNavigate()

  // TODO: obtener beneficios desde sessionStorage
  // const [beneficios, setBeneficios] = useState(null)
  // useEffect(() => {
  //   const data = sessionStorage.getItem('beneficios')
  //   if (!data) { navigate('/preguntas'); return }
  //   setBeneficios(JSON.parse(data))
  // }, [navigate])

  // TODO: calcular total_estimado sumando monto_estimado de todos los beneficios

  return (
    <div>
      {/* TODO: <ContadorAnimado valor={total_estimado} prefijo="$" sufijo=" en beneficios" /> */}
      {/* TODO: mapear beneficios.beneficios → <BeneficioCard key={i} {...b} /> */}
      {/* TODO: mapear beneficios.productos_cmf → <ProductoCard key={i} {...p} /> */}
      {/* TODO: <PlanAccion pasos={beneficios.plan_accion} /> */}
      {/* TODO: botón de descarga PDF */}
      {/* TODO: botón de WhatsApp con link a wa.me */}
    </div>
  )
}
