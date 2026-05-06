import json
import os
import re

import anthropic

from agent.prompts import SYSTEM_PROMPT_WEB, SYSTEM_PROMPT_WHATSAPP
from agent.tools import calcular_impuesto, calcular_credito_fogape, obtener_productos_cmf

_client: anthropic.Anthropic | None = None

TOOLS_SCHEMA = [
    {
        'name': 'calcular_impuesto',
        'description': 'Calcula la multa anual por evasion y el ahorro en PPM si el emprendedor se formaliza.',
        'input_schema': {
            'type': 'object',
            'properties': {
                'rango_ingresos': {
                    'type': 'string',
                    'enum': ['menos_500k', '500k_1M', '1M_2M', '2M_5M', 'mas_5M'],
                    'description': 'Rango de ingresos mensuales del emprendedor',
                },
                'tiene_rut': {
                    'type': 'boolean',
                    'description': 'Si el emprendedor ya tiene RUT tributario activo',
                },
            },
            'required': ['rango_ingresos', 'tiene_rut'],
        },
    },
    {
        'name': 'calcular_credito_fogape',
        'description': 'Determina el monto maximo de credito Fogape disponible si el emprendedor se formaliza.',
        'input_schema': {
            'type': 'object',
            'properties': {
                'rango_ingresos': {
                    'type': 'string',
                    'enum': ['menos_500k', '500k_1M', '1M_2M', '2M_5M', 'mas_5M'],
                },
                'sector': {
                    'type': 'string',
                    'description': 'Sector del negocio: comercio, servicios, manufactura, agro, construccion, otro',
                },
            },
            'required': ['rango_ingresos', 'sector'],
        },
    },
    {
        'name': 'obtener_productos_cmf',
        'description': 'Retorna los 3 mejores productos financieros regulados por la CMF para el perfil del emprendedor.',
        'input_schema': {
            'type': 'object',
            'properties': {
                'rango_ingresos': {
                    'type': 'string',
                    'enum': ['menos_500k', '500k_1M', '1M_2M', '2M_5M', 'mas_5M'],
                },
                'sector': {'type': 'string'},
                'region': {
                    'type': 'string',
                    'description': 'Region de Chile donde opera. Usar "RM" si no se sabe.',
                },
            },
            'required': ['rango_ingresos', 'sector', 'region'],
        },
    },
]

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


def _extract_resultado(text: str) -> dict | None:
    match = re.search(r'<resultado>(.*?)</resultado>', text, re.DOTALL)
    if not match:
        return None
    try:
        return json.loads(match.group(1).strip())
    except json.JSONDecodeError:
        return None


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
        resultado = _extract_resultado(text)
        clean_text = re.sub(r'<resultado>.*?</resultado>', '', text, flags=re.DOTALL).strip()

        return {
            'response': clean_text,
            'finished': resultado is not None,
            'beneficios_json': resultado,
        }

    return {
        'response': 'Hubo un problema procesando tu información. Por favor intenta de nuevo.',
        'finished': False,
        'beneficios_json': None,
    }
