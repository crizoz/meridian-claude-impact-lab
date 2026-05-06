import os
from supabase import create_client, Client

# Cliente lazy-initialized para evitar error si las variables no están al importar
_supabase: Client | None = None


def get_client() -> Client:
    global _supabase
    if _supabase is None:
        url = os.getenv("SUPABASE_URL", "")
        key = os.getenv("SUPABASE_KEY", "")
        _supabase = create_client(url, key)
    return _supabase


def get_conversacion(telefono: str) -> dict | None:
    """
    Recupera el estado actual de una conversación por número de teléfono (WhatsApp).

    TODO: query SELECT en tabla 'conversaciones' filtrando por telefono
    TODO: retornar el dict con estado, contexto y paso_actual
    TODO: retornar None si no existe (primera vez que escribe ese número)
    """
    pass


def upsert_conversacion(telefono: str, estado: dict) -> None:
    """
    Crea o actualiza el estado de una conversación de WhatsApp.

    TODO: upsert en tabla 'conversaciones' con telefono como clave única
    TODO: actualizar los campos estado (JSON), contexto y paso_actual
    TODO: actualizar updated_at para saber cuándo fue el último mensaje
    """
    pass


def guardar_perfil(perfil_data: dict) -> str:
    """
    Guarda el perfil completo de la empresa asesorada al terminar el flujo.

    TODO: INSERT en tabla 'perfiles' con todos los campos del perfil
    TODO: incluir el JSON de beneficios detectados en campo beneficios_json
    TODO: registrar el canal ("web" o "whatsapp") en campo canal
    TODO: retornar el UUID del perfil creado
    TODO: llamar desde /chat cuando finished=True en la respuesta de Claude
    """
    pass


def get_stats() -> dict:
    """
    Obtiene las métricas de impacto para el StatsCounter del frontend.

    TODO: COUNT de tabla 'perfiles' para empresas_asesoradas
    TODO: SUM de beneficios_json->total para beneficios_detectados_mm
    TODO: COUNT DISTINCT de perfiles.region para regiones_cubiertas
    TODO: retornar {empresas_asesoradas: int, beneficios_detectados_mm: float, regiones: int}
    """
    pass
