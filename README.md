# Meridian — Claude Impact Lab Chile 2026

> Asesor financiero IA para microemprendedores informales chilenos.  
> En 5 minutos, una conversación con Claude revela en pesos reales cuánto dinero se está dejando sobre la mesa por no estar formalizado.

**Demo en vivo → [meridian-claude-impact-lab.vercel.app](https://meridian-claude-impact-lab.vercel.app)**

---

## El problema

Chile tiene 2 millones de microemprendedores. El 54,2% opera en la informalidad (INE, VIII EME 2025). No porque quieran evadir — sino porque nadie les mostró en números concretos qué ganarían al formalizarse.

Los informales ganan en promedio **$277.000/mes**. Los formalizados, **$1.115.000/mes**. La diferencia no es suerte — es acceso al sistema.

Meridian es la capa que faltaba: conversacional, en lenguaje simple, con datos reales del SII, CMF y Fogape.

---

## Cómo funciona

```
Usuario elige su dolor real
(crédito rechazado / necesito boleta / quiero crecer)
        ↓
Claude hace hasta 10 preguntas conversacionales
(rubro, ingresos, situación actual)
        ↓
Claude llama 3 herramientas en paralelo
(calcular_impuesto · calcular_credito_fogape · obtener_productos_cmf)
        ↓
Dashboard visual personalizado
(número central animado · beneficios en pesos reales · productos CMF · plan de acción)
        ↓
Plan de 5 pasos enviado por WhatsApp
(seguimiento automático a las 72 horas)
```

---

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | Python 3.11 + FastAPI |
| IA | Anthropic SDK — claude-sonnet-4-20250514 |
| Frontend | React + Vite + Tailwind CSS + Framer Motion |
| Base de datos | Supabase (PostgreSQL) |
| WhatsApp | Twilio Business API |
| Deploy backend | Railway |
| Deploy frontend | Vercel |

---

## Levantar local en 5 pasos

### 1. Variables de entorno
```bash
cp .env.example .env
# Completar con credenciales reales
```

Variables necesarias:
```env
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
VITE_API_URL=http://localhost:8000
ENVIRONMENT=development
```

### 2. Base de datos
Ejecutar `backend/db/schema.sql` en el SQL Editor de Supabase:
**Dashboard → SQL Editor → New Query → pegar contenido → Run**

Crea tres tablas:
- `conversaciones` — estado de sesiones WhatsApp
- `perfiles` — análisis generados (anonimizados)
- `stats` — contador en tiempo real para la landing

### 3. Backend
```bash
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd backend
uvicorn main:app --reload
# Disponible en http://localhost:8000
# Docs en http://localhost:8000/docs
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
# Disponible en http://localhost:5173
```

### 5. WhatsApp sandbox (Twilio)
```
1. Crear cuenta en twilio.com (gratis)
2. Messaging → Try it out → Send a WhatsApp message
3. Desde tu WhatsApp personal envía el código de activación al número sandbox
4. El webhook de Twilio apunta a: https://tu-backend.railway.app/whatsapp/webhook
```

---

## Endpoints del backend

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/chat` | Conversación con Claude (modo web) |
| `POST` | `/whatsapp/webhook` | Webhook de Twilio |
| `POST` | `/whatsapp/send-plan` | Envía plan completo por WhatsApp |
| `GET` | `/stats` | Contador en tiempo real para la landing |
| `GET` | `/health` | Health check para Railway |

### Contrato de `/chat`

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "A" },
    { "role": "assistant", "content": "..." }
  ],
  "mode": "web"
}
```

**Response — Claude preguntando:**
```json
{ "finished": false, "response": "¿Cuánto ganas al mes?" }
```

**Response — Claude terminó el análisis:**
```json
{
  "finished": true,
  "beneficios_json": {
    "total_estimado": 3240000,
    "ahorro_anual_multas": 980000,
    "acceso_capital_nuevo": 8000000,
    "beneficios": [...],
    "productos_cmf": [...],
    "plan_accion": [...]
  }
}
```

---

## Estructura del proyecto

```
meridian/
├── backend/
│   ├── main.py                      # FastAPI + routers
│   ├── agent/
│   │   ├── claude.py                # Llamadas a Claude API + parser JSON
│   │   ├── prompts.py               # System prompts web y WhatsApp
│   │   └── tools.py                 # calcular_impuesto · fogape · cmf
│   ├── data/
│   │   ├── sii_tablas.json          # Tasas reales SII 2024
│   │   ├── fogape.json              # Montos por rango de ventas
│   │   └── cmf_productos.json       # Productos reales BancoEstado · Coopeuch · Oriencoop
│   ├── db/
│   │   ├── supabase_client.py       # Cliente Supabase + funciones CRUD
│   │   └── schema.sql               # Tablas conversaciones · perfiles · stats
│   └── integrations/
│       ├── twilio_whatsapp.py       # Webhook + send_message
│       └── cmf_mcp.py               # Consulta registro CMF en tiempo real
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Entrada.jsx          # Landing · 3 puntos de dolor · stats
│   │   │   ├── Preguntas.jsx        # Flujo conversacional · mock/real
│   │   │   └── Resultado.jsx        # Dashboard visual · animaciones
│   │   ├── components/
│   │   │   ├── PreguntasFlow.jsx    # Burbujas de chat · opciones rápidas
│   │   │   ├── BeneficioCard.jsx    # Card animada de beneficio
│   │   │   ├── ContadorAnimado.jsx  # Número que crece desde 0
│   │   │   ├── ProductoCard.jsx     # Card de producto CMF
│   │   │   ├── PlanAccion.jsx       # Stepper de 5 pasos
│   │   │   └── StatsCounter.jsx    # Contador en tiempo real
│   │   └── App.jsx                  # Router
│   └── vercel.json
├── .env.example
├── requirements.txt
├── docker-compose.yml
└── README.md
```

---

## División de trabajo

| Dev | Área | Archivos |
|-----|------|----------|
| Dev 1 | Agente IA | `backend/agent/` · `backend/main.py` |
| Dev 2 | Integraciones y DB | `backend/integrations/` · `backend/db/` |
| Dev 3 | Frontend | `frontend/src/pages/` · `frontend/src/components/` |
| Dev 4 | Datos y Deploy | `backend/data/` · Railway · Vercel · variables de entorno |

---

## Ramas Git

```
main                  → producción
dev                   → integración
feature/agent         → Dev 1
feature/integrations  → Dev 2
feature/frontend      → Dev 3
feature/data-deploy   → Dev 4
```

**Regla:** PRs siempre hacia `dev`. Nunca directo a `main`.

---

## Deploy

### Backend → Railway
1. Conectar repositorio en railway.app
2. Root Directory: `meridian/backend`
3. Agregar todas las variables de entorno
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend → Vercel
1. Conectar repositorio en vercel.com
2. Root Directory: `meridian/frontend`
3. Framework: Vite
4. Agregar variable: `VITE_API_URL=https://tu-backend.railway.app`

---

## Decisiones técnicas

**Claude devuelve JSON puro siempre.**
El system prompt instruye a Claude a responder únicamente JSON válido en cada mensaje — sin texto libre, sin tags XML. El backend hace `json.loads()` directo, sin parser adicional. Si `finished: true` el JSON contiene `beneficios_json` con la estructura exacta que espera el frontend.

**sessionStorage como memoria del flujo web.**
El historial de mensajes se persiste en sessionStorage entre renders. Si el usuario recarga en medio del flujo, la conversación se restaura desde el último mensaje del asistente.

**Supabase para persistencia de WhatsApp.**
Cada número de teléfono tiene su sesión guardada en Supabase. Si Railway reinicia el proceso, las conversaciones de WhatsApp sobreviven. Los números se hashean con SHA256 antes de guardar.

**Theming dinámico por rubro.**
Claude decide el `color_primario` del perfil según el rubro del usuario. El frontend aplica ese color como CSS variable en toda la pantalla de resultado — gastronomía en naranja, servicios en azul, comercio en verde.

---

## Conexión con la Ley Fintech

Meridian no es un proyecto tributario — es la capa cero del Open Finance chileno.

La Ley 21.521 crea el marco de Open Finance que permite a personas compartir datos financieros para acceder a mejores productos. Sin RUT tributario activo, ese marco no existe para el microemprendedor informal. Cada usuario que se formaliza a través de Meridian entra al ecosistema que la Ley Fintech construyó.

---

## Fuentes de datos oficiales

- INE — VIII Encuesta de Microemprendimiento 2025: [ine.gob.cl](https://www.ine.gob.cl/estadisticas/sociales/mercado-laboral/microemprendimiento)
- SII — Estadísticas de empresas: [sii.cl](https://www.sii.cl/sobre_el_sii/estadisticas_de_empresas.html)
- CMF — Inclusión financiera: [cmf.cl](https://www.cmf.cl/inclusion-financiera/)
- Fogape: [fogape.cl](https://www.fogape.cl)
- Ley 21.521 Fintech: [bcn.cl](https://www.bcn.cl/leychile/navegar?idNorma=1128689)
- Ley 20.659 Empresa en un Día: [bcn.cl](https://www.bcn.cl/leychile/navegar?idNorma=1019323)

---

## Equipo

Construido en 48 horas en el Claude Impact Lab Chile 2026 — Espacio Riesco, Santiago.  
Primer hackathon de inclusión financiera con IA de Latinoamérica.

---

*Meridian no almacena datos personales sin consentimiento del usuario.*
