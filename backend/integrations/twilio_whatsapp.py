import json
import os

from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse

from agent.claude import call_claude
from db.supabase_client import get_conversacion, upsert_conversacion, guardar_perfil

TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_WHATSAPP_NUMBER = os.getenv('TWILIO_WHATSAPP_NUMBER', 'whatsapp:+14155238886')


def procesar_mensaje(form_data: dict) -> None:
    telefono = form_data.get('From', '').replace('whatsapp:', '')
    texto = form_data.get('Body', '').strip()

    conversacion = get_conversacion(telefono)
    historial = conversacion['estado'].get('messages', []) if conversacion else []

    historial.append({'role': 'user', 'content': texto})

    result = call_claude(historial, mode='whatsapp')

    historial.append({'role': 'assistant', 'content': result.get('response', '')})
    upsert_conversacion(telefono, {'messages': historial})

    if result.get('finished') and result.get('beneficios_json'):
        guardar_perfil({
            'canal': 'whatsapp',
            'beneficios_json': result['beneficios_json'],
        })
        bj = result['beneficios_json']
        multa = bj.get('ahorro_anual_multas', 0)
        credito = bj.get('acceso_capital_nuevo', 0)
        total = bj.get('total_estimado', multa + credito)

        respuesta = (
            f"✅ ¡Listo! Calculé tus beneficios:\n\n"
            f"💰 Crédito disponible: ${credito:,}\n"
            f"🚫 Multas que evitas: ${multa:,}/año\n"
            f"📊 Total estimado: ${total:,}\n\n"
            f"Pasos para formalizarte:\n"
        )
        for i, p in enumerate(bj.get('plan_accion', [])[:3], 1):
            if isinstance(p, dict):
                respuesta += f"{p.get('paso', i)}. {p.get('descripcion', '')}\n"
            else:
                respuesta += f"{i}. {p}\n"
    else:
        respuesta = result.get('response', 'Hubo un error, intenta de nuevo.')

    if len(respuesta) > 1000:
        send_message(telefono, respuesta[:1000])
        send_message(telefono, respuesta[1000:])
    else:
        send_message(telefono, respuesta)


def send_message(telefono: str, mensaje: str) -> str:
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    msg = client.messages.create(
        from_=TWILIO_WHATSAPP_NUMBER,
        to=f'whatsapp:{telefono}',
        body=mensaje,
    )
    return msg.sid
