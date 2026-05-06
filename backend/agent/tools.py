import json
import os

_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')


def _load(filename: str) -> dict:
    with open(os.path.join(_DATA_DIR, filename), encoding='utf-8') as f:
        return json.load(f)


def calcular_impuesto(rango_ingresos: str, tiene_rut: bool) -> dict:
    data = _load('sii_tablas.json')
    uf = data['uf_a_clp']

    multa_anual = 0 if tiene_rut else data['multas_evasion']['rango_estimado_anual_por_rango_ingresos'].get(rango_ingresos, 280000)

    rangos_a_uf = {
        'menos_500k': 150,
        '500k_1M': 300,
        '1M_2M': 600,
        '2M_5M': 1500,
        'mas_5M': 4000,
    }
    ventas_uf_anuales = rangos_a_uf.get(rango_ingresos, 300)
    regimen = 'RES' if ventas_uf_anuales <= 2400 else '14D'

    tasa_ppm = data['regimenes'][regimen]['tasa_ppm_pct'] / 100
    ventas_clp_mensuales = (ventas_uf_anuales * uf) / 12
    impuesto_mensual = int(ventas_clp_mensuales * tasa_ppm)

    return {
        'regimen_recomendado': regimen,
        'impuesto_mensual_estimado': impuesto_mensual,
        'multa_anual': multa_anual,
    }


def calcular_credito_fogape(rango_ingresos: str, sector: str) -> dict:
    data = _load('fogape.json')
    uf = _load('sii_tablas.json')['uf_a_clp']

    rango_data = next(
        (r for r in data['rangos_credito'] if r['rango_ventas_mensuales_clp'] == rango_ingresos),
        data['rangos_credito'][0],
    )

    monto_max_uf = rango_data['monto_max_credito_uf']
    return {
        'monto_max_pesos': monto_max_uf * uf,
        'monto_max_uf': monto_max_uf,
        'tasa_referencial': f"{rango_data['tasa_garantia_anual_pct']}%",
        'plazo_max_meses': rango_data['plazo_max_meses'],
        'institucion_recomendada': data['instituciones_participantes'][0],
    }


def obtener_productos_cmf(rango_ingresos: str, sector: str, region: str) -> list[dict]:
    data = _load('cmf_productos.json')
    uf = _load('sii_tablas.json')['uf_a_clp']

    segmento = 'pequena empresa' if rango_ingresos in ('2M_5M', 'mas_5M') else 'microempresa'
    productos = [p for p in data['productos'] if segmento in p['segmento']]
    productos.sort(key=lambda p: p['tasa_referencial_anual_pct'])

    return [
        {
            'institucion': p['institucion'],
            'producto': p['producto'],
            'monto_max_pesos': p['monto_max_uf'] * uf,
            'monto_max_uf': p['monto_max_uf'],
            'tasa': f"{p['tasa_referencial_anual_pct']}%",
            'plazo_meses': p['plazo_max_meses'],
            'link': p['link'],
        }
        for p in productos[:3]
    ]
