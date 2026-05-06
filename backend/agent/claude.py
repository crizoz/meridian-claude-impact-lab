import json
import os

import anthropic

from agent.prompts import SYSTEM_PROMPT_WEB, SYSTEM_PROMPT_WHATSAPP
from agent.tools import calcular_impuesto, calcular_credito_fogape, obtener_productos_cmf

_client: anthropic.Anthropic | None = None

_SCHEMA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'tools_schema.json')
with open(_SCHEMA_PATH, encoding='utf-8') as _f:
    TOOLS_SCHEMA: list[dict] = json.load(_f)

_TOOL_FN = {
    'calcular_impuesto': calcular_impuesto,
    'calcular_credito_fogape': calcular_credito_fogape,
    'obtener_productos_cmf': obtener_productos_cmf,
}


def get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
    return _client


def _limpiar_texto(texto: str) -> str:
    texto = texto.strip()
    if texto.startswith('```'):
        lines = texto.splitlines()
        # sacar primera y ultima linea (``` o ```json)
        inner = lines[1:-1] if lines[-1].strip() == '```' else lines[1:]
        texto = '\n'.join(inner).strip()
    return texto


def _parsear_respuesta(texto: str) -> dict:
    try:
        data = json.loads(_limpiar_texto(texto))
        if data.get('finished') is True:
            return {'finished': True, 'beneficios_json': data['beneficios_json']}
        return {'finished': False, 'response': data.get('response', texto)}
    except json.JSONDecodeError:
        return {'finished': False, 'response': texto}


def call_claude(messages: list[dict], mode: str = 'web') -> dict:
    system = SYSTEM_PROMPT_WEB if mode == 'web' else SYSTEM_PROMPT_WHATSAPP
    history = list(messages)

    for _ in range(10):
        response = get_client().messages.create(
            model='claude-sonnet-4-6',
            max_tokens=2048,
            system=system,
            messages=history,
            tools=TOOLS_SCHEMA,
        )

        if response.stop_reason == 'tool_use':
            tool_results = []
            for block in response.content:
                if block.type == 'tool_use':
                    fn = _TOOL_FN.get(block.name)
                    result = fn(**block.input) if fn else {'error': 'tool not found'}
                    tool_results.append({
                        'type': 'tool_result',
                        'tool_use_id': block.id,
                        'content': json.dumps(result, ensure_ascii=False),
                    })
            history.append({'role': 'assistant', 'content': response.content})
            history.append({'role': 'user', 'content': tool_results})
            continue

        text = next((b.text for b in response.content if b.type == 'text'), '')
        return _parsear_respuesta(text)

    return {
        'finished': False,
        'response': 'Hubo un problema procesando tu información. Por favor intenta de nuevo.',
    }
