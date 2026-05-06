import os

# Credenciales de Twilio — se inicializa el cliente solo cuando se usan las funciones
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")  # formato: whatsapp:+14155238886


async def webhook(request) -> str:
    """
    Recibe y procesa el webhook de Twilio para mensajes entrantes de WhatsApp.

    Flujo completo:
    1. Usuario envía mensaje a tu número de WhatsApp Twilio
    2. Twilio hace POST a esta URL con form-encoded: From, Body, MessageSid, etc.
    3. Extraer From (ej: "whatsapp:+56912345678") y Body (texto del mensaje)
    4. Consultar estado previo: db/supabase_client.get_conversacion(telefono)
    5. Llamar a agent/claude.py con historial + mensaje nuevo
    6. Guardar nuevo estado: db/supabase_client.upsert_conversacion(telefono, estado)
    7. Si Claude responde rápido (<5s): retornar XML TwiML con la respuesta
    8. Si Claude tarda: retornar TwiML vacío y llamar send_message cuando termine

    TODO: extraer From y Body del request con form data de FastAPI (Request.form())
    TODO: limpiar el "whatsapp:" prefix del número para guardar en Supabase
    TODO: construir el XML de respuesta TwiML: <Response><Message>texto</Message></Response>
    TODO: manejar el caso en que el usuario envía audio (Twilio lo transcribe)

    Returns:
        String con XML TwiML para que Twilio lo procese
    """
    pass


def send_message(telefono: str, mensaje: str) -> None:
    """
    Envía un mensaje de WhatsApp saliente vía Twilio (para respuestas asíncronas).

    Usar cuando la respuesta de Claude tarda más de 5 segundos —
    Twilio cierra la conexión del webhook a los 15 segundos.

    Args:
        telefono: Número en formato internacional sin prefijo (ej: "+56912345678")
        mensaje: Texto del mensaje (máx ~1600 chars; WhatsApp lo divide automáticamente)

    TODO: importar twilio.rest.Client y crear instancia con TWILIO_ACCOUNT_SID y AUTH_TOKEN
    TODO: llamar client.messages.create(from_=TWILIO_WHATSAPP_NUMBER, to="whatsapp:"+telefono, body=mensaje)
    TODO: si el mensaje supera 1000 chars, dividirlo en dos mensajes para mejor lectura
    TODO: loggear el MessageSid retornado por Twilio para debugging
    """
    pass
