from __future__ import annotations

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


def _parsear_respuesta(texto: str) -> dict:
    texto_limpio = texto.strip()
    
    start_dict = texto_limpio.find('{')
    end_dict = texto_limpio.rfind('}')
    start_list = texto_limpio.find('[')
    end_list = texto_limpio.rfind(']')
    
    json_candidate = texto_limpio
    
    if start_dict != -1 and end_dict != -1 and end_dict > start_dict:
        if start_list != -1 and start_list < start_dict and end_list > end_dict:
            json_candidate = texto_limpio[start_list:end_list+1]
        else:
            json_candidate = texto_limpio[start_dict:end_dict+1]
    elif start_list != -1 and end_list != -1 and end_list > start_list:
        json_candidate = texto_limpio[start_list:end_list+1]
        
    try:
        data = json.loads(json_candidate)

        if isinstance(data, list):
            return {
                'finished': True,
                'beneficios_json': {
                    'productos_cmf': data,
                }
            }

        if not isinstance(data, dict):
            raise ValueError("Parsed JSON is not a dict or list")

        is_finished = data.get('finished') is True
        has_final_keys = any(k in data for k in ['beneficios', 'plan_accion', 'productos_cmf', 'total_estimado', 'beneficios_json'])

        if is_finished or has_final_keys:
            beneficios = data.get('beneficios_json')
            if not isinstance(beneficios, dict):
                beneficios = data
            return {'finished': True, 'beneficios_json': beneficios}

        return {'finished': False, 'response': data.get('response') or texto}
    except Exception:
        return {'finished': False, 'response': texto}


def call_claude(messages: list[dict], mode: str = 'web') -> dict:
    system = SYSTEM_PROMPT_WEB if mode == 'web' else SYSTEM_PROMPT_WHATSAPP
    # La API de Anthropic requiere que el primer mensaje sea role 'user'.
    # El frontend incluye el saludo inicial de Meridian como 'assistant',
    # así que lo descartamos antes de enviar.
    history = [m for m in messages if isinstance(m.get('content'), str) or isinstance(m.get('content'), list)]
    
    if history and history[0].get('role') == 'assistant':
        intro_content = history[0].get('content', '')
        history.insert(0, {
            'role': 'user',
            'content': f"Hola. Ya recibí tu saludo: '{intro_content}'. Continúa con la siguiente pregunta."
        })

    for _ in range(10):
        response = get_client().messages.create(
            model='claude-haiku-4-5-20251001',
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
