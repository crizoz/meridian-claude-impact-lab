# Integración con el registro público de la CMF (Comisión para el Mercado Financiero).
#
# La CMF publica datos de instituciones financieras reguladas en:
# https://www.cmfchile.cl/portal/estadisticas/606/w3-channel.html
#
# Estrategia recomendada:
# 1. Primero intentar via servidor MCP de la CMF (si existe uno oficial)
# 2. Si no, usar la API REST pública de la CMF
# 3. Fallback: retornar datos desde backend/data/cmf_productos.json
# 4. Cachear resultados en Supabase para no consultar en cada request


async def get_institucion(nombre: str) -> dict | None:
    """
    Obtiene datos actualizados de una institución financiera desde el registro CMF.

    Args:
        nombre: Nombre de la institución (ej: "BancoEstado", "Coopeuch", "Oriencoop")

    Returns:
        dict con datos actualizados de la institución:
        {nombre, rut, productos: [{nombre, monto_max_uf, tasa_anual_pct, plazo_meses}]}
        None si la institución no está en el registro CMF

    TODO: verificar si hay un servidor MCP oficial de la CMF disponible
    TODO: si no hay MCP, usar endpoint: GET https://api.cmfchile.cl/api-sbifv3/recursos/... (verificar URL)
    TODO: cachear la respuesta en Supabase por 24 horas (tasas no cambian a diario)
    TODO: si CMF no responde, hacer fallback a backend/data/cmf_productos.json con log de advertencia
    """
    pass
