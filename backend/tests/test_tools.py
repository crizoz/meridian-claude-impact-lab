import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from agent.tools import calcular_impuesto, calcular_credito_fogape, obtener_productos_cmf


def test_calcular_impuesto_sin_rut_retorna_multa():
    result = calcular_impuesto("1M_2M", False)
    assert result["multa_anual"] > 0
    assert result["regimen_recomendado"] in ("RES", "14D")
    assert "impuesto_mensual_estimado" in result


def test_calcular_impuesto_con_rut_no_tiene_multa():
    result = calcular_impuesto("1M_2M", True)
    assert result["multa_anual"] == 0


def test_calcular_impuesto_ingresos_altos_recomienda_14D():
    result = calcular_impuesto("mas_5M", False)
    assert result["regimen_recomendado"] == "14D"


def test_calcular_credito_fogape_retorna_campos_correctos():
    result = calcular_credito_fogape("1M_2M", "comercio")
    assert result["monto_max_pesos"] > 0
    assert result["monto_max_uf"] > 0
    assert "tasa_referencial" in result
    assert "plazo_max_meses" in result
    assert "institucion_recomendada" in result


def test_calcular_credito_fogape_monto_en_pesos_coherente():
    result = calcular_credito_fogape("1M_2M", "servicios")
    assert result["monto_max_pesos"] == result["monto_max_uf"] * 38500


def test_obtener_productos_cmf_retorna_max_3():
    result = obtener_productos_cmf("1M_2M", "comercio", "Metropolitana")
    assert 1 <= len(result) <= 3


def test_obtener_productos_cmf_contiene_campos_requeridos():
    result = obtener_productos_cmf("500k_1M", "servicios", "Metropolitana")
    for p in result:
        assert "institucion" in p
        assert "producto" in p
        assert "monto_max_uf" in p
        assert "monto_max_pesos" in p
        assert "tasa" in p
        assert "plazo_meses" in p
        assert "link" in p


def test_obtener_productos_cmf_tasa_es_string_con_porcentaje():
    result = obtener_productos_cmf("1M_2M", "comercio", "Metropolitana")
    for p in result:
        assert "%" in p["tasa"]
