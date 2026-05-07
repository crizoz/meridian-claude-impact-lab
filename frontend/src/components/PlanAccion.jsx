// PlanAccion — timeline vertical, paso a paso
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const C = {
  bg: '#F8F4ED',
  bgCard: '#EDEAE3',
  ink: '#1A1A1A',
  inkMid: '#4A4A48',
  inkSoft: '#76756F',
  inkFaint: '#A8A6A0',
  line: '#DCD8CF',
  lineSoft: '#E8E5DC',
  accent: '#0F3D2E',
}

const STORAGE_KEY = 'meridian_plan_completado'

// Links canónicos por tipo de acción
const LINK_MAP = [
  {
    keywords: ['inicio de actividades', 'iniciar actividades', 'iniciar actividad'],
    href: 'https://zeus.sii.cl/cvc_cgi/stc/getiavias.cgi',
    label: 'Iniciar en SII.cl →',
  },
  {
    keywords: ['sii', 'rut', 'formaliz', 'actividades económicas', 'registro sii'],
    href: 'https://www.sii.cl/servicios_online/1040-inicio_de_actividades.html',
    label: 'Ir al SII →',
  },
  {
    keywords: ['boleta electrónica', 'boleta', 'factura electrónica', 'emisión de boleta'],
    href: 'https://misiir.sii.cl',
    label: 'Portal Boletas SII →',
  },
  {
    keywords: ['cuenta rut', 'cuentarut', 'cuenta corriente', 'cuenta vista', 'bancoestado'],
    href: 'https://www.bancoestado.cl/content/bancoestado-public/cl/es/home/personas/cuentas/cuenta-rut.html',
    label: 'Ir a BancoEstado →',
  },
  {
    keywords: ['fogape'],
    href: 'https://www.fogape.cl/sitio/emprendedores/',
    label: 'Ir a Fogape →',
  },
  {
    keywords: ['corfo', 'subsidio corfo'],
    href: 'https://www.corfo.cl/sites/cpp/emprendedores',
    label: 'Ir a Corfo →',
  },
  {
    keywords: ['coopeuch'],
    href: 'https://www.coopeuch.cl/personas/creditos/credito-emprendedor.html',
    label: 'Ir a Coopeuch →',
  },
  {
    keywords: ['oriencoop'],
    href: 'https://www.oriencoop.cl',
    label: 'Ir a Oriencoop →',
  },
  {
    keywords: ['registro de empresa', 'registro empresa', 'sociedad', 'empresa en un día'],
    href: 'https://www.registrodeempresasysociedades.cl',
    label: 'Registrar empresa →',
  },
  {
    keywords: ['previred', 'cotizaciones', 'previsión', 'afp', 'isapre'],
    href: 'https://www.previred.com',
    label: 'Ir a Previred →',
  },
  {
    keywords: ['municipio', 'patente', 'municipal'],
    href: 'https://www.munitel.cl',
    label: 'Municipio en línea →',
  },
  {
    keywords: ['sence', 'capacitación', 'franquicia tributaria'],
    href: 'https://www.sence.cl',
    label: 'Ir a Sence →',
  },
]

function resolveLink(accion, linkRecurso) {
  const text = (accion ?? '').toLowerCase()

  // Si el link del backend es específico (no solo dominio raíz), usarlo
  if (linkRecurso) {
    try {
      const url = new URL(linkRecurso)
      if (url.pathname.length > 1) {
        // Buscar label descriptivo igual
        for (const entry of LINK_MAP) {
          if (entry.keywords.some(k => text.includes(k))) {
            return { href: linkRecurso, label: entry.label }
          }
        }
        return { href: linkRecurso, label: 'Ir al sitio →' }
      }
    } catch { /* URL inválida, seguir */ }
  }

  // Buscar en el mapa por keywords de la acción
  for (const entry of LINK_MAP) {
    if (entry.keywords.some(k => text.includes(k))) {
      return { href: entry.href, label: entry.label }
    }
  }

  // Fallback al link genérico del backend si existe
  if (linkRecurso) return { href: linkRecurso, label: 'Ir al sitio →' }

  return null
}

function StepIcon({ accion }) {
  const d = (accion ?? '').toLowerCase()
  if (d.includes('sii') || d.includes('formaliz') || d.includes('rut') || d.includes('actividades'))
    return (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <rect width="36" height="36" rx="9" fill="#EFF6FF" />
        <text x="18" y="22" fill="#005A9C" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">Sii</text>
        <line x1="10" y1="26" x2="26" y2="26" stroke="#005A9C" strokeWidth="2" />
      </svg>
    )
  if (d.includes('cuenta') || d.includes('banco') || d.includes('corriente') || d.includes('bancoestado'))
    return (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <rect width="36" height="36" rx="9" fill="#F0FDF4" />
        <rect x="7" y="11" width="22" height="14" rx="2" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
        <line x1="7" y1="16" x2="29" y2="16" stroke="#16A34A" strokeWidth="1.5" />
        <rect x="10" y="20" width="5" height="2.5" rx="1" fill="#4ADE80" />
      </svg>
    )
  if (d.includes('boleta') || d.includes('factura') || d.includes('emisión'))
    return (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <rect width="36" height="36" rx="9" fill="#FFF7ED" />
        <rect x="11" y="7" width="14" height="22" rx="2" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1.5" />
        <line x1="14" y1="13" x2="22" y2="13" stroke="#FED7AA" strokeWidth="1.5" />
        <line x1="14" y1="17" x2="22" y2="17" stroke="#FED7AA" strokeWidth="1.5" />
      </svg>
    )
  if (d.includes('fogape') || d.includes('crédito') || d.includes('credito'))
    return (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <rect width="36" height="36" rx="9" fill="#F0FDF4" />
        <rect x="9" y="13" width="18" height="11" rx="2" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
        <circle cx="18" cy="18.5" r="2.5" fill="#16A34A" />
        <path d="M12 13 V 9 A 6 6 0 0 1 24 9 V 13" fill="none" stroke="#4ADE80" strokeWidth="2" />
      </svg>
    )
  if (d.includes('corfo') || d.includes('subsidio') || d.includes('sence'))
    return (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <rect width="36" height="36" rx="9" fill="#ECFDF5" />
        <text x="18" y="17" fill="#0F3D2E" fontSize="8" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">CORFO</text>
        <rect x="10" y="22" width="3.5" height="6" rx="1" fill="#A7F3D0" />
        <rect x="16" y="18" width="3.5" height="10" rx="1" fill="#6EE7B7" />
        <rect x="22" y="20" width="3.5" height="8" rx="1" fill="#34D399" />
      </svg>
    )
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <rect width="36" height="36" rx="9" fill={C.bgCard} />
      <circle cx="18" cy="18" r="7" fill="none" stroke={C.inkFaint} strokeWidth="2" />
      <line x1="18" y1="14" x2="18" y2="18" stroke={C.inkFaint} strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="21" r="1" fill={C.inkFaint} />
    </svg>
  )
}

// Urgencia por posición: los primeros pasos son más urgentes
function urgenciaPorNumero(numero) {
  if (numero <= 2) return { label: 'Urgente', bg: '#FEE2E2', color: '#DC2626' }
  if (numero <= 4) return { label: 'Pronto',  bg: '#FEF3C7', color: '#D97706' }
  return              { label: 'Luego',   bg: '#F3F4F6', color: '#6B7280' }
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function PlanAccion({ pasos }) {
  const [completados, setCompletados] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completados))
  }, [completados])

  const toggle = (id) =>
    setCompletados(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )

  const done = completados.length
  const total = pasos.length

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: C.inkMid, margin: '0 0 6px',
        }}>
          Tu plan de acción
        </p>
        {done > 0 && (
          <p style={{ fontSize: 12, color: C.inkSoft, margin: 0 }}>
            {done} de {total} completados
          </p>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
      >
        <div style={{
          position: 'absolute', left: 15, top: 30, bottom: 20,
          width: 1, background: C.line, zIndex: 0,
        }} />

        {pasos.map((p, index) => {
          // Soporta ambos esquemas: {numero, accion} y {paso, descripcion}
          const id     = p.numero   ?? p.paso
          const accion = p.accion   ?? p.descripcion ?? ''
          const plazo  = p.plazo    ?? null

          const hecho  = completados.includes(id)
          const urg    = urgenciaPorNumero(id)
          const link   = resolveLink(accion, p.link_recurso)
          const isLast = index === pasos.length - 1

          return (
            <motion.div
              key={id}
              variants={itemVariants}
              style={{
                display: 'flex', gap: 14,
                marginBottom: isLast ? 0 : 20,
                position: 'relative', zIndex: 1,
              }}
            >
              {/* Número circular */}
              <button
                onClick={() => toggle(id)}
                title={hecho ? 'Marcar como pendiente' : 'Marcar como completado'}
                style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  border: 'none',
                  background: hecho ? '#4ADE80' : C.accent,
                  color: hecho ? C.accent : '#FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, background 0.2s',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12, fontWeight: 700,
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.88)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {hecho ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : id}
              </button>

              {/* Contenido */}
              <div style={{
                flex: 1,
                background: hecho ? 'transparent' : C.bgCard,
                border: `1px solid ${hecho ? 'transparent' : C.lineSoft}`,
                borderRadius: 14,
                padding: hecho ? '2px 0' : '14px 16px',
                transition: 'all 0.3s',
                opacity: hecho ? 0.55 : 1,
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  {!hecho && (
                    <div style={{ flexShrink: 0, marginTop: 1 }}>
                      <StepIcon accion={accion} />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: '0 0 8px',
                      fontSize: 13.5, fontWeight: 600, color: C.ink,
                      textDecoration: hecho ? 'line-through' : 'none',
                      lineHeight: 1.45,
                    }}>
                      {accion}
                    </p>

                    {!hecho && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          background: urg.bg, color: urg.color,
                          borderRadius: 100, padding: '3px 9px',
                        }}>
                          {urg.label}
                        </span>

                        {plazo && (
                          <span style={{ fontSize: 11, color: C.inkSoft, fontWeight: 500 }}>
                            {plazo}
                          </span>
                        )}

                        {link && (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: 11, fontWeight: 600,
                              color: C.accent, textDecoration: 'none',
                            }}
                          >
                            {link.label}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {done === total && total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 20, padding: '14px 16px',
            background: '#F0FDF4', borderRadius: 12,
            border: '1px solid #BBF7D0',
            fontSize: 13, fontWeight: 600, color: '#15803D',
            textAlign: 'center',
          }}
        >
          ¡Completaste todos los pasos! Tu negocio está en camino.
        </motion.div>
      )}
    </div>
  )
}
