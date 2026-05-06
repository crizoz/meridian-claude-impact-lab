# Meridian — Claude Impact Lab Chile

## IMPORTANTE: API Key

**No llamar a la Anthropic API ni consumir la API key durante el desarrollo.**
Toda llamada a `client.messages.create()` o similar gasta créditos reales.
Para probar el agente localmente: usar respuestas mock o el modo `--dry-run` si se implementa.
La API key solo se usa en Railway (producción) y en demos del hackathon.

---

## Qué es el proyecto

Meridian es una herramienta IA que ayuda a emprendedores informales chilenos a entender en pesos concretos cuánto ganan formalizándose. El usuario llega por un dolor real (quiere un crédito, le pidieron boleta, quiere crecer) y el agente revela que la formalización resuelve ese dolor.

**Target:** 1.8 millones de microemprendedores informales en Chile — sin RUT tributario activo, sin historial crediticio.

**El insight central:** el entry point no es "quiero formalizarme" — es el dolor inmediato. El agente detecta ese dolor y muestra que formalizarse es la solución.

---

## Flujo del producto (5 pantallas)

1. **Entrada por dolor real** — 3 opciones: quiero un crédito / me pidieron boleta / quiero crecer mi negocio
2. **Preguntas conversacionales** — una a la vez, máx 12 preguntas, lenguaje de la calle. Claude decide si necesita más info.
3. **Beneficios primero** — en pesos reales: crédito máximo al que califica, productos financieros, beneficios estatales. Después el costo de seguir informal (multas SII, beneficios bloqueados). El número grande central: diferencia anual a favor de formalizarse.
4. **Productos financieros reales** — cards con entidades reguladas CMF, calculadas sobre el perfil real (Fogape, BancoEstado, Coopeuch, Oriencoop, Corfo).
5. **Plan de acción** — 5 pasos con fecha, link directo y tiempo estimado. Recordatorio por WhatsApp vía Twilio.

---

## Stack técnico

| Capa | Tech |
|------|------|
| Backend | Python 3.11 + FastAPI |
| IA | Anthropic SDK — Claude Sonnet 4.6 |
| Frontend | React + Vite + Tailwind + Framer Motion |
| DB | Supabase (PostgreSQL) |
| WhatsApp | Twilio |
| Deploy | Vercel (frontend) + Railway (backend) |

---

## División de trabajo

| Dev | Área | Archivos |
|-----|------|----------|
| Dev 1 (yo) | Agente IA | `backend/agent/claude.py` · `backend/agent/prompts.py` · `backend/agent/tools.py` · `backend/main.py` |
| Dev 2 | Integraciones y DB | `backend/integrations/` · `backend/db/` |
| Dev 3 | Frontend | `frontend/src/pages/` · `frontend/src/components/` |
| Dev 4 | Datos y Deploy | `backend/data/` · `railway.json` · `frontend/vercel.json` |

---

## Alcance de Dev 1 (este repo en este Claude Code)

Responsable de:
- `backend/agent/claude.py` — implementar `call_claude()`: selección de system prompt, tool use loop completo, streaming opcional
- `backend/agent/prompts.py` — system prompts para web y WhatsApp, flujo de preguntas de formalización
- `backend/agent/tools.py` — implementar las 3 tools: `calcular_impuesto`, `calcular_credito_fogape`, `obtener_productos_cmf`
- `backend/main.py` — conectar endpoint `/chat` con `call_claude()`

**No tocar:** `backend/db/`, `backend/integrations/`, `frontend/`, `backend/data/` (esos son de otros devs)

---

## Arquitectura del agente

**Single agent con tools** (no multi-agent — 48h de hackathon, priorizar que funcione).

Claude recibe el historial completo en cada llamada. Cuando necesita calcular algo, invoca una tool. El tool use loop corre en el backend (no en el cliente).

Flujo de preguntas que debe seguir el agente:
1. Detectar el dolor real del usuario (crédito / boleta / crecer)
2. Bloque actividad: qué vende/ofrece, trabaja solo o con ayuda, vende solo en Chile
3. Bloque dinero: rango de ingresos mensuales (5 opciones predefinidas), si son parejos o estacionales, gastos del negocio de su bolsillo
4. Bloque situación actual: si tiene RUT o emite boletas, si tiene cuenta bancaria para el negocio, si alguna vez intentó pedir crédito
5. Llamar tools para calcular beneficios
6. Retornar JSON estructurado con `finished: true`

---

## Output final del agente (JSON)

```json
{
  "finished": true,
  "response": "mensaje final para el usuario",
  "beneficios_json": {
    "diferencia_anual_pesos": 2400000,
    "beneficios": [
      {
        "tipo": "tributario|financiero|estatal",
        "titulo": "string",
        "descripcion": "string",
        "monto_estimado": 1200000,
        "primer_paso": "string"
      }
    ],
    "productos_cmf": [
      {
        "institucion": "BancoEstado",
        "producto": "Microcrédito Emprendedor",
        "monto_max_uf": 100,
        "tasa_anual_pct": 12.5,
        "link": "https://..."
      }
    ],
    "plan_accion": [
      {
        "numero": 1,
        "accion": "Iniciar actividades en SII.cl",
        "responsable": "Usuario",
        "plazo": "Hoy, 30 minutos",
        "link_recurso": "https://www.sii.cl"
      }
    ],
    "costo_informal": {
      "multa_potencial_anual": 500000,
      "beneficios_bloqueados": ["Fogape", "Corfo", "CuentaRUT Emprendedor"]
    }
  }
}
```

---

## Reglas del agente

- Lenguaje de la calle — sin jerga tributaria ni legal
- Una pregunta a la vez — nunca más de una por mensaje
- Máximo 12 preguntas antes de calcular
- Si el usuario sube foto de boleta, extraer monto y rubro automáticamente
- No dar asesoría legal — siempre sugerir contador para casos complejos
- Régimen a recomendar para informales: RES (Renta Efectiva Simplificada) o 14D según perfil

---

## Variables de entorno requeridas (Dev 1)

```
ANTHROPIC_API_KEY=     # Solo para producción en Railway — no usar localmente
```
