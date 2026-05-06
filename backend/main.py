import os
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent.claude import call_claude
from integrations.twilio_whatsapp import procesar_mensaje
from db.supabase_client import get_stats

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
    messages: List[dict]
    mode: str = 'web'


class ChatResponse(BaseModel):
    response: Optional[str] = None
    finished: bool
    beneficios_json: Optional[dict] = None


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
async def whatsapp_webhook(request: Request, background_tasks: BackgroundTasks):
    form_data = dict(await request.form())
    background_tasks.add_task(procesar_mensaje, form_data)
    from fastapi.responses import Response
    from twilio.twiml.messaging_response import MessagingResponse
    return Response(content=str(MessagingResponse()), media_type='application/xml')


@app.get('/stats')
async def stats():
    return get_stats()
