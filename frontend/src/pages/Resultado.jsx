// frontend/src/pages/Resultado.jsx
// Muestra los beneficios detectados por Claude al finalizar el flujo de preguntas.
// Datos desde sessionStorage['meridian_beneficios'] (guardado en Preguntas.jsx).

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ContadorAnimado from '../components/ContadorAnimado'
import BeneficioCard from '../components/BeneficioCard'
import ProductoCard from '../components/ProductoCard'
import PlanAccion from '../components/PlanAccion'

const C = {
  bg: '#F8F4ED',
  bgCard: '#EDEAE3',
  bgCard2: '#FFFFFF',
  ink: '#1A1A1A',
  inkMid: '#4A4A48',
  inkSoft: '#76756F',
  inkFaint: '#A8A6A0',
  line: '#DCD8CF',
  lineSoft: '#E8E5DC',
  accent: '#0F3D2E',
  accentDeep: '#082319',
}

const WA_NUMBER = '14155238886'

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

function SectionLabel({ texto }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 700,
      color: C.accent, textTransform: 'uppercase',
      letterSpacing: '0.16em', margin: '0 0 14px',
    }}>
      {texto}
    </p>
  )
}

function IconBack() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function Resultado() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('meridian_beneficios')
    if (!raw) { navigate('/preguntas'); return }
    try { setData(JSON.parse(raw)) }
    catch { navigate('/preguntas') }
  }, [navigate])

  if (!data) return null

  const montoFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP', maximumFractionDigits: 0,
  }).format(data.total_estimado)

  const handleWhatsApp = () => {
    const texto = encodeURIComponent(
      `¡Hola! Usé Meridian y encontré ${montoFormateado} en beneficios para mi negocio. Me gustaría recibir asesoría para acceder a ellos.`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${texto}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>

      {/* ── Header fijo ── */}
      <div style={{
        padding: '16px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${C.lineSoft}`,
        background: C.bg,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: 'none',
            color: C.inkMid, cursor: 'pointer',
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 13, fontWeight: 500, padding: '4px 0',
          }}
        >
          <IconBack />
          Calcular de nuevo
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/Logo.svg" alt="Meridian"
            style={{ height: 28, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 14, fontWeight: 800, color: C.ink,
            letterSpacing: '0.10em', textTransform: 'uppercase',
          }}>
            Meridian
          </span>
        </div>

        <button
          onClick={() => window.print()}
          style={{
            background: 'transparent', border: `1px solid ${C.line}`,
            borderRadius: 100, padding: '5px 14px',
            fontSize: 11, fontWeight: 600, color: C.inkMid,
            cursor: 'pointer', letterSpacing: '0.04em',
          }}
        >
          PDF ↓
        </button>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 22px 80px' }}>

        {/* ── Hero: total de beneficios ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: C.accent,
            borderRadius: 24,
            padding: '32px 28px',
            margin: '24px 0',
            textAlign: 'center',
          }}
        >
          <p style={{
            fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 12px',
          }}>
            Beneficios disponibles para tu perfil
          </p>
          <div style={{
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 'clamp(40px, 12vw, 60px)',
            fontWeight: 800, color: '#FFFFFF',
            lineHeight: 1, letterSpacing: '-0.03em',
            marginBottom: 14,
          }}>
            $<ContadorAnimado valor={data.total_estimado} duracion_ms={2200} />
          </div>
          <p style={{
            fontSize: 14, color: 'rgba(255,255,255,0.70)',
            margin: '0 0 24px', lineHeight: 1.5, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Es lo que ganarías anualmente una vez que formalices tu actividad.
          </p>

          {/* Resumen rápido de categorías */}
          <div style={{
            display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {data.beneficios.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.12)', borderRadius: 100,
                padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#FFFFFF',
              }}>
                {data.beneficios.length} beneficios
              </div>
            )}
            {data.productos_cmf?.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.12)', borderRadius: 100,
                padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#FFFFFF',
              }}>
                {data.productos_cmf.length} productos financieros
              </div>
            )}
            {data.plan_accion?.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.12)', borderRadius: 100,
                padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#FFFFFF',
              }}>
                {data.plan_accion.length} pasos de acción
              </div>
            )}
          </div>
        </motion.div>

        {/* ── CTA WhatsApp — visible arriba ── */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWhatsApp}
          style={{
            width: '100%',
            background: '#25D366',
            border: 'none',
            borderRadius: 16,
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: '#fff',
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: 15, fontWeight: 700,
            cursor: 'pointer',
            marginBottom: 28,
            letterSpacing: '0.02em',
          }}
        >
          <IconWhatsApp />
          Recibir asesoría por WhatsApp
        </motion.button>

        {/* ── Beneficios detectados ── */}
        {data.beneficios.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 36 }}
          >
            <SectionLabel texto={`${data.beneficios.length} beneficios para tu perfil`} />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {data.beneficios.map((b, i) => (
                <BeneficioCard key={i} {...b} />
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* ── Créditos CMF ── */}
        {data.productos_cmf?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 36 }}
          >
            <SectionLabel texto="Créditos disponibles en el sistema financiero" />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {data.productos_cmf.map((p, i) => (
                <ProductoCard key={i} {...p} />
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* ── Plan de acción ── */}
        {data.plan_accion?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 36 }}
          >
            <PlanAccion pasos={data.plan_accion} />
          </motion.section>
        )}

        {/* ── CTAs finales ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <button
            onClick={handleWhatsApp}
            style={{
              width: '100%',
              background: '#25D366', border: 'none',
              borderRadius: 16, padding: '16px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10, color: '#fff',
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            <IconWhatsApp />
            Hablar con un asesor por WhatsApp
          </button>

          <button
            onClick={() => window.print()}
            style={{
              width: '100%',
              background: 'transparent',
              border: `1.5px solid ${C.line}`,
              borderRadius: 16, padding: '14px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, color: C.inkMid,
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Descargar reporte PDF ↓
          </button>

          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent', border: 'none',
              color: C.inkFaint, cursor: 'pointer', padding: '8px',
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontSize: 13, fontWeight: 500,
            }}
          >
            ← Calcular de nuevo con otro perfil
          </button>
        </motion.div>

        {/* Footer */}
        <p style={{
          fontSize: 12, color: C.inkFaint,
          textAlign: 'center', marginTop: 36, lineHeight: 1.6,
        }}>
          Meridian no almacena datos personales sin tu consentimiento.
          <br />
          Construido en Claude Impact Lab Chile 2026.
        </p>

      </div>
    </div>
  )
}
