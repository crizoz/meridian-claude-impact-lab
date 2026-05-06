import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from agent.tools import calcular_impuesto, calcular_credito_fogape, obtener_productos_cmf


def test_calcular_impuesto_sin_rut_retorna_multa():
    result = calcular_impuesto("1M_2M", False)
    assert result["multa_anual"] > 0
    assert result["regimen_recomendado"] in ("RES", "14D")
    assert "ahorro_ppm_anual" in result


def test_calcular_impuesto_con_rut_no_tiene_multa():
    result = calcular_impuesto("1M_2M", True)
    assert result["multa_anual"] == 0


def test_calcular_impuesto_ingresos_altos_recomienda_14D():
    result = calcular_impuesto("mas_5M", False)
    assert result["regimen_recomendado"] == "14D"


def test_calcular_credito_fogape_retorna_monto():
    result = calcular_credito_fogape("1M_2M", "comercio")
    assert result["califica"] is True
    assert result["monto_max_uf"] > 0
    assert result["monto_max_pesos"] > 0
    assert len(result["pasos"]) > 0


def test_calcular_credito_fogape_monto_en_pesos_coherente():
    result = calcular_credito_fogape("1M_2M", "servicios")
    assert result["monto_max_pesos"] == result["monto_max_uf"] * 38500


def test_obtener_productos_cmf_retorna_max_3():
    result = obtener_productos_cmf("1M_2M", "comercio", "RM")
    assert 1 <= len(result) <= 3
    assert all("tasa_anual_pct" in p for p in result)


def test_obtener_productos_cmf_ordenados_por_tasa():
    result = obtener_productos_cmf("1M_2M", "comercio", "RM")
    tasas = [p["tasa_anual_pct"] for p in result]
    assert tasas == sorted(tasas)


def test_obtener_productos_cmf_contiene_campos_requeridos():
    result = obtener_productos_cmf("500k_1M", "servicios", "RM")
    for p in result:
        assert "institucion" in p
        assert "producto" in p
        assert "monto_max_uf" in p
        assert "link" in p
