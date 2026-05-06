# Meridian — Claude Impact Lab Chile

Meridian es un asesor financiero IA que ayuda a pymes y microempresarios chilenos a descubrir los beneficios tributarios, financieros y de capacitación disponibles para su negocio. En 5 minutos, una conversación con Claude identifica cuánto dinero se está dejando sobre la mesa.

---

## Levantar local en 5 pasos

**1. Variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales reales
```

**2. Backend**
```bash
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd backend
uvicorn main:app --reload
# Backend disponible en http://localhost:8000
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
# Frontend disponible en http://localhost:5173
```

**4. Base de datos**

Ejecutar `backend/db/schema.sql` en el SQL Editor de Supabase (Dashboard → SQL Editor → New Query).

**5. Verificar**
- Backend health: http://localhost:8000/health
- API docs: http://localhost:8000/docs
- Frontend: http://localhost:5173

---

## División de trabajo

| Dev | Área | Archivos |
|-----|------|----------|
| **Dev 1** | Agente IA | `backend/agent/claude.py` · `backend/agent/prompts.py` · `backend/agent/tools.py` · `backend/main.py` |
| **Dev 2** | Integraciones y DB | `backend/integrations/twilio_whatsapp.py` · `backend/integrations/cmf_mcp.py` · `backend/db/supabase_client.py` · `backend/db/schema.sql` |
| **Dev 3** | Frontend | `frontend/src/pages/` · `frontend/src/components/` |
| **Dev 4** | Datos y Deploy | `backend/data/` · `railway.json` · `frontend/vercel.json` · variables de entorno en Railway y Vercel |

---

## Estructura de ramas Git

```
main                  → producción (solo merge desde dev con PR aprobado)
dev                   → integración continua
feature/agent         → Dev 1
feature/integrations  → Dev 2
feature/frontend      → Dev 3
feature/data-deploy   → Dev 4
```

**Regla:** los PRs siempre van hacia `dev`. Nunca directo a `main`.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Backend | Python 3.11 + FastAPI |
| IA | Anthropic SDK (Claude Opus) |
| Frontend | React + Vite + Tailwind CSS + Framer Motion |
| Base de datos | Supabase (PostgreSQL) |
| WhatsApp | Twilio |
| Deploy backend | Railway |
| Deploy frontend | Vercel |
