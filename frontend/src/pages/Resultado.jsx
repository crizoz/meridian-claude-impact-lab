// frontend/src/pages/Resultado.jsx
// Muestra los beneficios detectados por Claude al finalizar el flujo de preguntas.
//
// Fuente de datos: sessionStorage['meridian_beneficios'] (guardado en Preguntas.jsx).
// Si no hay datos, redirige a /preguntas.
//
// Secciones:
//   1. Hero — total de beneficios animado (ContadorAnimado)
//   2. Beneficios detectados — BeneficioCard con stagger de entrada
//   3. Créditos disponibles — ProductoCard con stagger de entrada
//   4. Plan de acción — PlanAccion con checkboxes persistidos en localStorage
//   5. CTAs — WhatsApp + descarga PDF
//
// ─────────────────────────────────────────────────────────────────────────────
// CONECTAR BACKEND:
//
// Esta página NO hace fetch directamente. Recibe los datos desde sessionStorage,
// que los guarda Preguntas.jsx al finalizar el flujo con Claude.
//
// Si en el futuro se quiere recargar o compartir resultados por URL (por ejemplo,
// vía /resultado?sesion=abc123), agregar un useEffect que haga:
//
//   const params = new URLSearchParams(location.search)
//   const sesionId = params.get('sesion')
//   if (sesionId) {
//     fetch(`${import.meta.env.VITE_API_URL}/resultado/${sesionId}`)
//       .then(r => r.json())
//       .then(setData)
//   }
//
// El endpoint debe devolver el mismo tipo BeneficiosJSON que retorna /chat.
// ─────────────────────────────────────────────────────────────────────────────
//
// WhatsApp:
//   Configurar VITE_WHATSAPP_NUMBER en .env con el número Twilio (ej: 56999999999)
//   El link wa.me abre la app con un mensaje preformateado que incluye el monto.
//
// PDF:
//   Por ahora usa window.print() con @media print de index.css.
//   TODO: reemplazar por POST /api/pdf → blob descargable para mayor control de estilos.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ContadorAnimado from '../components/ContadorAnimado'
import BeneficioCard from '../components/BeneficioCard'
import ProductoCard from '../components/ProductoCard'
import PlanAccion from '../components/PlanAccion'

// Número de WhatsApp (Twilio sandbox o número real).
// Configurar en .env: VITE_WHATSAPP_NUMBER=56912345678
const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '56999999999'

// Variantes para el stagger de entrada de las cards.
// BeneficioCard y ProductoCard definen sus propias variantes con los mismos
// nombres ("hidden" / "show"), por eso Framer Motion las propaga automáticamente.
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

// Label de sección — mismo estilo tipográfico que en Entrada.jsx y Preguntas.jsx
function SectionLabel({ texto }) {
  return (
    <p style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '13px',
      fontWeight: 500,
      color: 'rgba(245,240,232,0.35)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      margin: '0 0 16px',
    }}>
      {texto}
    </p>
  )
}

export default function Resultado() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    // Leer beneficios guardados por Preguntas.jsx al finalizar el flujo
    const raw = sessionStorage.getItem('meridian_beneficios')
    if (!raw) {
      navigate('/preguntas')
      return
    }
    try {
      setData(JSON.parse(raw))
    } catch {
      // JSON inválido → volver al flujo
      navigate('/preguntas')
    }
  }, [navigate])

  // No renderizar nada hasta tener los datos (evita flash de contenido vacío)
  if (!data) return null

  const handleWhatsApp = () => {
    // Mensaje preformateado con el monto detectado para contextualizar la consulta
    const monto = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(data.total_estimado)
    const texto = encodeURIComponent(
      `¡Hola! Usé Meridian y encontré ${monto} en beneficios disponibles para mi negocio. Me gustaría recibir asesoría para acceder a ellos.`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${texto}`, '_blank', 'noopener,noreferrer')
  }

  const handleDescargarPDF = () => {
    // Imprime la página actual como PDF usando el diálogo nativo del navegador.
    // TODO: reemplazar por generación desde el backend para mayor control de estilos:
    //   const res = await fetch(`${import.meta.env.VITE_API_URL}/pdf`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    //   })
    //   const blob = await res.blob()
    //   const url = URL.createObjectURL(blob)
    //   const a = document.createElement('a')
    //   a.href = url; a.download = 'meridian-reporte.pdf'; a.click()
    //   URL.revokeObjectURL(url)
    window.print()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F0E0C',
      position: 'relative',
    }}>

      {/* Fondo decorativo — mismo que Entrada.jsx */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(251,191,36,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '560px',
        margin: '0 auto',
        padding: '0 24px 80px',
        position: 'relative',
      }}>

        {/* ── Logo + navegación ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            paddingTop: '32px',
            paddingBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(245,240,232,0.3)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            ← Calcular de nuevo
          </button>
        </motion.div>

        {/* ── Hero: total de beneficios ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '56px' }}
        >
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px', fontWeight: 500,
            color: 'rgba(245,240,232,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: '0 0 8px',
          }}>
            Beneficios detectados para tu negocio
          </p>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(48px, 12vw, 72px)',
            fontWeight: 800,
            color: '#F5F0E8',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginBottom: '16px',
          }}>
            $<ContadorAnimado valor={data.total_estimado} duracion_ms={2200} />
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            color: 'rgba(245,240,232,0.55)',
            margin: 0,
            lineHeight: 1.7,
            maxWidth: '420px',
          }}>
            Accedes a estos beneficios una vez que formalices tu actividad.
            La ruta es más corta de lo que crees.
          </p>
        </motion.div>

        {/* ── Sección: beneficios tributarios y financieros ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '48px' }}
        >
          <SectionLabel texto={`${data.beneficios.length} beneficios disponibles para tu perfil`} />

          {/* staggerContainer propaga "hidden"/"show" a los BeneficioCard hijos */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {data.beneficios.map((b, i) => (
              <BeneficioCard key={i} {...b} />
            ))}
          </motion.div>
        </motion.section>

        {/* ── Sección: créditos del sistema financiero (CMF) ── */}
        {data.productos_cmf?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '48px' }}
          >
            <SectionLabel texto="Créditos disponibles en el sistema financiero" />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {data.productos_cmf.map((p, i) => (
                <ProductoCard key={i} {...p} />
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* ── Sección: plan de acción con checkboxes ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '48px' }}
        >
          <PlanAccion pasos={data.plan_accion} />
        </motion.section>

        {/* ── CTAs principales ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}
        >
          {/* WhatsApp — CTA principal */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWhatsApp}
            style={{
              background: '#25D366',
              border: 'none',
              borderRadius: '14px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#fff',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '20px' }}>💬</span>
            Continuar por WhatsApp
          </motion.button>

          {/* PDF — CTA secundario */}
          <motion.button
            whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.07)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDescargarPDF}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: 'rgba(245,240,232,0.7)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <span style={{ fontSize: '18px' }}>↓</span>
            Descargar reporte PDF
          </motion.button>
        </motion.div>

        {/* ── Footer ── */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '12px',
          color: 'rgba(245,240,232,0.2)',
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          Meridian no almacena datos personales sin tu consentimiento.
          <br />
          Construido en Claude Impact Lab Chile 2026.
        </p>

      </div>
    </div>
  )
}
