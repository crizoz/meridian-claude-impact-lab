// Página de entrada — landing page de Meridian
//
// Muestra el dolor real del microempresario y convierte a /preguntas.
//
// Secciones a implementar:
// 1. Hero: título con el problema real (ej: "El 70% de las pymes paga más
//    impuestos de los que debería. ¿Eres uno de ellos?")
// 2. Tres pain points como botones/cards: tributario, financiero, capacitación
// 3. StatsCounter con empresas asesoradas, beneficios detectados y regiones
// 4. CTA principal: "Descubre tus beneficios en 5 minutos" → /preguntas
//
// Animaciones: entrada con Framer Motion (fade + slide up staggered)

import { useNavigate } from 'react-router-dom'
import StatsCounter from '../components/StatsCounter'

export default function Entrada() {
  const navigate = useNavigate()

  // TODO: fetch desde /stats para obtener datos reales del StatsCounter
  // const [stats, setStats] = useState({ empresas: 0, beneficios_mm: 0, regiones: 0 })
  // useEffect(() => { fetch('/api/stats').then(...).then(setStats) }, [])

  return (
    <div>
      {/* TODO: Hero section con título de dolor real y subtítulo */}
      {/* TODO: Tres pain points como cards clickeables */}
      {/* TODO: <StatsCounter empresas={stats.empresas} beneficios_mm={stats.beneficios_mm} regiones={stats.regiones} /> */}
      {/* TODO: Botón CTA principal que llama navigate('/preguntas') */}
    </div>
  )
}
