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
    ventas_clp_anuales = ventas_uf_anuales * uf
    ahorro_ppm_anual = int(ventas_clp_anuales * tasa_ppm * 0.3)

    return {
        'multa_anual': multa_anual,
        'ahorro_ppm_anual': ahorro_ppm_anual,
        'regimen_recomendado': regimen,
        'descripcion': (
            f"Con el régimen {data['regimenes'][regimen]['nombre']}, pagas PPM del "
            f"{data['regimenes'][regimen]['tasa_ppm_pct']}% mensual sobre tus ventas."
        ),
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
        'califica': True,
        'monto_max_uf': monto_max_uf,
        'monto_max_pesos': monto_max_uf * uf,
        'cobertura_pct': rango_data['cobertura_garantia_pct'],
        'plazo_max_meses': rango_data['plazo_max_meses'],
        'pasos': data['pasos_para_solicitarlo'],
        'instituciones': data['instituciones_participantes'][:3],
    }


def obtener_productos_cmf(rango_ingresos: str, sector: str, region: str) -> list[dict]:
    data = _load('cmf_productos.json')

    segmento = 'pequena empresa' if rango_ingresos in ('2M_5M', 'mas_5M') else 'microempresa'
    productos = [p for p in data['productos'] if segmento in p['segmento']]
    productos.sort(key=lambda p: p['tasa_referencial_anual_pct'])

    return [
        {
            'institucion': p['institucion'],
            'producto': p['producto'],
            'monto_max_uf': p['monto_max_uf'],
            'tasa_anual_pct': p['tasa_referencial_anual_pct'],
            'plazo_max_meses': p['plazo_max_meses'],
            'descripcion': p['descripcion'],
            'link': p['link'],
        }
        for p in productos[:3]
    ]
