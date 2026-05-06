import anthropic
import os

# Cliente lazy-initialized para evitar error si ANTHROPIC_API_KEY no está al importar
_client: anthropic.Anthropic | None = None


def get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    return _client


def call_claude(messages: list[dict], mode: str = "web") -> str:
    """
    Llama a Claude con el historial de conversación.

    Args:
        messages: Lista de mensajes [{role: "user"|"assistant", content: str}]
        mode: "web" para el flujo del frontend, "whatsapp" para Twilio

    Returns:
        Respuesta de Claude como string

    TODO: seleccionar system prompt según mode (ver agent/prompts.py)
    TODO: registrar tools de tool use: calcular_impuesto, calcular_credito_fogape, obtener_productos_cmf
    TODO: manejar tool use loop: si Claude llama una tool, ejecutarla y continuar
    TODO: cuando Claude termine el flujo, retornar JSON estructurado con beneficios
    TODO: implementar streaming para el frontend (usar client.messages.stream)
    """
    # TODO: importar prompts según mode
    # from agent.prompts import SYSTEM_PROMPT_WEB, SYSTEM_PROMPT_WHATSAPP
    # system_prompt = SYSTEM_PROMPT_WEB if mode == "web" else SYSTEM_PROMPT_WHATSAPP

    # TODO: definir tools para que Claude pueda calcular beneficios
    # tools = [
    #     {"name": "calcular_impuesto", ...},
    #     {"name": "calcular_credito_fogape", ...},
    #     {"name": "obtener_productos_cmf", ...},
    # ]

    # TODO: llamar a la API de Claude
    # response = get_client().messages.create(
    #     model="claude-opus-4-7",
    #     max_tokens=2048,
    #     system=system_prompt,
    #     messages=messages,
    #     tools=tools,
    # )
    # return response.content[0].text

    return "TODO: implementar respuesta de Claude"
