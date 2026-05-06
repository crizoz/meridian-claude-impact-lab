import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent.claude import call_claude

app = FastAPI(
    title='Meridian API',
    description='Agente IA que ayuda a emprendedores informales chilenos a entender los beneficios de formalizarse.',
    version='0.1.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


class ChatRequest(BaseModel):
    messages: list[dict]
    mode: str = 'web'


class ChatResponse(BaseModel):
    response: str | None = None
    finished: bool
    beneficios_json: dict | None = None


@app.get('/health')
async def health():
    return {'status': 'ok', 'service': 'meridian-backend'}


@app.post('/chat', response_model=ChatResponse)
async def chat(body: ChatRequest):
    if not body.messages:
        raise HTTPException(status_code=400, detail='messages no puede estar vacío')
    if body.mode not in ('web', 'whatsapp'):
        raise HTTPException(status_code=400, detail='mode debe ser "web" o "whatsapp"')
    return call_claude(body.messages, body.mode)


@app.post('/whatsapp')
async def whatsapp_webhook():
    # Dev 2 implementa este endpoint
    pass


@app.get('/stats')
async def stats():
    # Dev 2 implementa este endpoint
    pass
