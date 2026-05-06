-- Schema de Meridian para Supabase
-- Ejecutar completo en: Supabase Dashboard → SQL Editor → New Query

-- Tabla de conversaciones de WhatsApp (estado persistente entre mensajes)
CREATE TABLE IF NOT EXISTS conversaciones (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    telefono    TEXT        UNIQUE NOT NULL,
    estado      JSONB       DEFAULT '{}',       -- contexto acumulado de la conversación
    contexto    TEXT        DEFAULT '',          -- historial como texto para el prompt
    paso_actual INTEGER     DEFAULT 0,           -- en qué pregunta del flujo va el usuario
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Tabla de perfiles de empresas asesoradas (un row por asesoría completada)
CREATE TABLE IF NOT EXISTS perfiles (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_empresa        TEXT,                   -- "persona_natural" | "spa" | "ltda" | "otro"
    regimen             TEXT,                   -- "14D" | "14A" | "pro_pyme" | "desconocido"
    rango_ingresos      TEXT,                   -- "0-25M" | "25M-75M" | "75M-200M" | "200M+"
    numero_trabajadores TEXT,                   -- "solo_yo" | "1-4" | "5-49" | "50+"
    sector              TEXT,                   -- "comercio" | "servicios" | "manufactura" | etc.
    region              TEXT,                   -- región de Chile
    canal               TEXT        DEFAULT 'web',   -- "web" | "whatsapp"
    beneficios_json     JSONB       DEFAULT '{}',    -- output completo de Claude
    created_at          TIMESTAMPTZ DEFAULT now()
);

-- Tabla de estadísticas agregadas (se actualiza con trigger o cron job)
CREATE TABLE IF NOT EXISTS stats (
    id                      UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    empresas_asesoradas     INTEGER DEFAULT 0,
    beneficios_detectados_mm NUMERIC DEFAULT 0, -- en millones de pesos
    regiones_cubiertas      INTEGER DEFAULT 0,
    updated_at              TIMESTAMPTZ DEFAULT now()
);

-- Row inicial de stats (la app siempre hace SELECT, nunca INSERT)
INSERT INTO stats (empresas_asesoradas, beneficios_detectados_mm, regiones_cubiertas)
VALUES (0, 0, 0);

-- Índices para las queries más frecuentes
CREATE INDEX IF NOT EXISTS idx_conversaciones_telefono ON conversaciones (telefono);
CREATE INDEX IF NOT EXISTS idx_perfiles_canal ON perfiles (canal);
CREATE INDEX IF NOT EXISTS idx_perfiles_created ON perfiles (created_at DESC);
