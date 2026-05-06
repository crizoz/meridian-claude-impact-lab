from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Meridian API",
    description="API para Meridian — Asesor financiero IA para pymes chilenas",
    version="0.1.0",
)

# Habilitar CORS para el frontend en Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restringir a dominio de Vercel en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    # Endpoint de salud para Railway y monitoring
    return {"status": "ok", "service": "meridian-backend"}


@app.post("/chat")
async def chat():
    # TODO: recibir body con {messages: list, mode: "web"}
    # TODO: llamar a agent/claude.py con el historial completo
    # TODO: retornar {response: str, finished: bool, beneficios_json: dict | None}
    # finished=True indica que Claude terminó el flujo de preguntas
    pass


@app.post("/whatsapp")
async def whatsapp_webhook():
    # TODO: recibir webhook form-encoded de Twilio (From, Body, MessageSid)
    # TODO: consultar estado previo en Supabase via db/supabase_client.py
    # TODO: llamar a agent/claude.py con historial y mensaje nuevo
    # TODO: guardar nuevo estado en Supabase
    # TODO: responder con XML TwiML o llamar send_message si Claude tarda
    pass


@app.get("/stats")
async def stats():
    # TODO: llamar a db/supabase_client.get_stats()
    # TODO: retornar {empresas_asesoradas, beneficios_detectados_mm, regiones}
    # Estos datos los consume StatsCounter en el frontend
    pass
