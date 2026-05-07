from __future__ import annotations

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
    res = get_client().table('conversaciones').select('*').eq('telefono', telefono).execute()
    return res.data[0] if res.data else None


def upsert_conversacion(telefono: str, estado: dict) -> None:
    get_client().table('conversaciones').upsert(
        {'telefono': telefono, 'estado': estado, 'updated_at': 'now()'},
        on_conflict='telefono',
    ).execute()


def guardar_perfil(perfil_data: dict) -> str:
    res = get_client().table('perfiles').insert(perfil_data).execute()
    return res.data[0]['id']


def get_stats() -> dict:
    client = get_client()
    perfiles = client.table('perfiles').select('id', count='exact').execute()
    empresas = perfiles.count or 0

    stats_row = client.table('stats').select('*').limit(1).execute()
    if stats_row.data:
        row = stats_row.data[0]
        return {
            'empresas_asesoradas': empresas,
            'beneficios_detectados_mm': float(row.get('beneficios_detectados_mm', 0)),
            'regiones_cubiertas': row.get('regiones_cubiertas', 0),
        }
    return {'empresas_asesoradas': empresas, 'beneficios_detectados_mm': 0, 'regiones_cubiertas': 0}
