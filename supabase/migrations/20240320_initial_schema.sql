-- Crear tabla de categorías
CREATE TABLE categorias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de bancos
CREATE TABLE bancos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    saldo DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de tarjetas de crédito
CREATE TABLE tarjetas_credito (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    banco_id UUID REFERENCES bancos(id),
    limite DECIMAL(10,2) NOT NULL,
    saldo DECIMAL(10,2) DEFAULT 0,
    fecha_cierre INTEGER NOT NULL,
    fecha_pago INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de gastos
CREATE TABLE gastos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    categoria TEXT NOT NULL,
    fecha DATE NOT NULL,
    tipo_pago TEXT NOT NULL CHECK (tipo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
    banco_id UUID REFERENCES bancos(id),
    tarjeta_id UUID REFERENCES tarjetas_credito(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de ahorros
CREATE TABLE ahorros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    tipo_ahorro TEXT NOT NULL CHECK (tipo_ahorro IN ('diario', 'semanal', 'mensual', 'anual')),
    fecha DATE NOT NULL,
    meta DECIMAL(10,2),
    banco_id UUID REFERENCES bancos(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de inversiones
CREATE TABLE inversiones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('acciones', 'bonos', 'fondos', 'criptomonedas', 'bienes_raices', 'otros')),
    fecha DATE NOT NULL,
    retorno_esperado DECIMAL(5,2),
    tipo_pago TEXT NOT NULL CHECK (tipo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
    banco_id UUID REFERENCES bancos(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de deudas
CREATE TABLE deudas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    interes DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de objetivos mensuales
CREATE TABLE objetivos_mensuales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    anio INTEGER NOT NULL,
    completado BOOLEAN DEFAULT FALSE,
    progreso DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insertar categorías por defecto
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Alimentación', 'Gastos en comida y bebidas'),
    ('Transporte', 'Gastos en transporte público o privado'),
    ('Vivienda', 'Gastos relacionados con la vivienda'),
    ('Servicios', 'Servicios básicos como luz, agua, internet'),
    ('Entretenimiento', 'Gastos en ocio y entretenimiento'),
    ('Salud', 'Gastos médicos y de salud'),
    ('Educación', 'Gastos en educación y formación'),
    ('Otros', 'Otros gastos no categorizados');

-- Habilitar RLS (Row Level Security)
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
CREATE POLICY "Permitir inserción de gastos" ON gastos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir lectura de gastos" ON gastos
  FOR SELECT
  USING (true);

CREATE POLICY "Permitir actualización de gastos" ON gastos
  FOR UPDATE
  USING (true);

CREATE POLICY "Permitir eliminación de gastos" ON gastos
  FOR DELETE
  USING (true);

-- Habilitar RLS para bancos
ALTER TABLE bancos ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para bancos
CREATE POLICY "Permitir inserción de bancos" ON bancos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir lectura de bancos" ON bancos
  FOR SELECT
  USING (true);

-- Habilitar RLS para tarjetas
ALTER TABLE tarjetas_credito ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para tarjetas
CREATE POLICY "Permitir inserción de tarjetas" ON tarjetas_credito
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir lectura de tarjetas" ON tarjetas_credito
  FOR SELECT
  USING (true);

-- Habilitar RLS para ahorros
ALTER TABLE ahorros ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para ahorros
CREATE POLICY "Permitir inserción de ahorros" ON ahorros
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir lectura de ahorros" ON ahorros
  FOR SELECT
  USING (true);

-- Habilitar RLS para inversiones
ALTER TABLE inversiones ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para inversiones
CREATE POLICY "Permitir inserción de inversiones" ON inversiones
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir lectura de inversiones" ON inversiones
  FOR SELECT
  USING (true);

-- Habilitar RLS para deudas
ALTER TABLE deudas ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para deudas
CREATE POLICY "Permitir inserción de deudas" ON deudas
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir lectura de deudas" ON deudas
  FOR SELECT
  USING (true);

-- Habilitar RLS para objetivos
ALTER TABLE objetivos_mensuales ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad para objetivos
CREATE POLICY "Permitir inserción de objetivos" ON objetivos_mensuales
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir lectura de objetivos" ON objetivos_mensuales
  FOR SELECT
  USING (true);

-- Permitir SELECT e INSERT a todos
CREATE POLICY "Permitir insertar a todos" ON gastos
  FOR INSERT USING (true);

CREATE POLICY "Permitir leer a todos" ON gastos
  FOR SELECT USING (true); 