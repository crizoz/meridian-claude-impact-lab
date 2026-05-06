import sys
import os
import json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from unittest.mock import patch, MagicMock
from agent.claude import call_claude, TOOLS_SCHEMA


def _text_response(text: str):
    msg = MagicMock()
    msg.stop_reason = 'end_turn'
    block = MagicMock()
    block.type = 'text'
    block.text = text
    msg.content = [block]
    return msg


def _tool_response(tool_name: str, tool_input: dict, tool_use_id: str = 'tu_1'):
    msg = MagicMock()
    msg.stop_reason = 'tool_use'
    block = MagicMock()
    block.type = 'tool_use'
    block.name = tool_name
    block.input = tool_input
    block.id = tool_use_id
    msg.content = [block]
    return msg


def test_tools_schema_tiene_3_tools():
    assert len(TOOLS_SCHEMA) == 3
    nombres = {t['name'] for t in TOOLS_SCHEMA}
    assert nombres == {'calcular_impuesto', 'calcular_credito_fogape', 'obtener_productos_cmf'}


def test_tools_schema_tiene_campos_requeridos():
    for tool in TOOLS_SCHEMA:
        assert 'name' in tool
        assert 'description' in tool
        assert 'input_schema' in tool


def test_call_claude_sin_resultado_retorna_finished_false():
    with patch('agent.claude.get_client') as mock_client:
        mock_client.return_value.messages.create.return_value = _text_response(
            'Hola! Para ayudarte mejor, cuéntame: ¿por qué estás aquí hoy?'
        )
        result = call_claude([{'role': 'user', 'content': 'hola'}], mode='web')

    assert result['finished'] is False
    assert result['response'] != ''
    assert result['beneficios_json'] is None


def test_call_claude_parsea_resultado_json():
    resultado = {
        'finished': True,
        'diferencia_anual_pesos': 2000000,
        'beneficios': [],
        'productos_cmf': [],
        'plan_accion': [],
        'costo_informal': {'multa_potencial_anual': 500000, 'beneficios_bloqueados': []},
    }
    texto = f'Aqui estan tus resultados.\n<resultado>\n{json.dumps(resultado)}\n</resultado>'

    with patch('agent.claude.get_client') as mock_client:
        mock_client.return_value.messages.create.return_value = _text_response(texto)
        result = call_claude([{'role': 'user', 'content': 'ok'}], mode='web')

    assert result['finished'] is True
    assert result['beneficios_json']['diferencia_anual_pesos'] == 2000000
    assert '<resultado>' not in result['response']


def test_call_claude_ejecuta_tool_y_continua():
    resultado = {'finished': True, 'diferencia_anual_pesos': 1000000,
                 'beneficios': [], 'productos_cmf': [], 'plan_accion': [],
                 'costo_informal': {'multa_potencial_anual': 0, 'beneficios_bloqueados': []}}
    texto_final = f'Listo!\n<resultado>\n{json.dumps(resultado)}\n</resultado>'

    with patch('agent.claude.get_client') as mock_client:
        mock_client.return_value.messages.create.side_effect = [
            _tool_response('calcular_impuesto', {'rango_ingresos': '1M_2M', 'tiene_rut': False}),
            _text_response(texto_final),
        ]
        result = call_claude([{'role': 'user', 'content': 'gano 1M al mes'}], mode='web')

    assert result['finished'] is True
    assert mock_client.return_value.messages.create.call_count == 2


def test_call_claude_whatsapp_usa_prompt_distinto():
    with patch('agent.claude.get_client') as mock_client:
        mock_client.return_value.messages.create.return_value = _text_response('Hola!')
        call_claude([{'role': 'user', 'content': 'hola'}], mode='whatsapp')

    call_args = mock_client.return_value.messages.create.call_args
    system = call_args.kwargs.get('system') or call_args.args[0] if call_args.args else call_args.kwargs['system']
    assert 'WhatsApp' in system
