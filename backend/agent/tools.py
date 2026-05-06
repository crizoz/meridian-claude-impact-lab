# Herramientas (tools) que Claude puede invocar para calcular beneficios reales.
# Cada función recibe parámetros del perfil del usuario y retorna datos estructurados.
# Registrar estas funciones como tools en agent/claude.py con sus JSON schemas.


def calcular_impuesto(rango_ingresos: str, regimen: str) -> dict:
    """
    Calcula el ahorro tributario potencial cambiando de régimen.

    Args:
        rango_ingresos: "0-25M" | "25M-75M" | "75M-200M" | "200M+"
        regimen: "14D" | "14A" | "pro_pyme" | "desconocido"

    Returns:
        {
            tasa_ppm_actual: float,
            regimen_optimo: str,
            ahorro_anual_estimado_pesos: int,
            descripcion: str
        }

    TODO: cargar datos desde backend/data/sii_tablas.json
    TODO: calcular la diferencia entre el régimen actual y el régimen óptimo
    TODO: si regimen == "desconocido", comparar los 3 regímenes y recomendar el mejor
    TODO: retornar monto de ahorro anual estimado en pesos chilenos
    """
    pass


def calcular_credito_fogape(rango_ingresos: str) -> dict:
    """
    Determina si el negocio califica para garantía FOGAPE y el monto máximo.

    Args:
        rango_ingresos: Rango de ventas mensuales del negocio

    Returns:
        {
            califica: bool,
            monto_max_uf: int,
            cobertura_garantia_pct: int,
            plazo_max_meses: int,
            pasos_siguientes: list[str]
        }

    TODO: cargar datos desde backend/data/fogape.json
    TODO: validar requisitos: ventas dentro del rango, más de 1 año en el mercado
    TODO: si califica, retornar condiciones y los pasos para solicitarlo
    TODO: si no califica, retornar alternativas (CORFO, BancoEstado microcrédito)
    """
    pass


def obtener_productos_cmf(perfil: dict) -> list[dict]:
    """
    Filtra y retorna productos financieros regulados disponibles para el perfil.

    Args:
        perfil: {
            sector: str,
            rango_ingresos: str,
            numero_trabajadores: str,
            region: str
        }

    Returns:
        Lista de productos ordenados por tasa de menor a mayor:
        [{institucion, producto, monto_max_uf, tasa_anual_pct, plazo_max_meses, link}]

    TODO: cargar datos desde backend/data/cmf_productos.json
    TODO: filtrar por segmento (microempresa, pequeña empresa, mediana empresa)
    TODO: opcionalmente llamar a integrations/cmf_mcp.py para tasas actualizadas
    TODO: ordenar por tasa_anual_pct de menor a mayor
    TODO: retornar máximo 3 productos para no sobrecargar al usuario
    """
    pass
