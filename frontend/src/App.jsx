import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Entrada from './pages/Entrada'
import Preguntas from './pages/Preguntas'
import Resultado from './pages/Resultado'

// Router principal — 3 etapas del flujo Meridian: landing → preguntas → resultados
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Entrada />} />
        <Route path="/preguntas" element={<Preguntas />} />
        <Route path="/resultado" element={<Resultado />} />
      </Routes>
    </BrowserRouter>
  )
}
