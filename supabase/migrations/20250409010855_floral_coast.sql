/*
  # Esquema inicial del sistema financiero

  1. Nuevas Tablas
    - `usuarios`: Almacena la información de los usuarios
    - `bancos`: Registro de bancos asociados a los usuarios
    - `tarjetas_credito`: Tarjetas de crédito de los usuarios
    - `categorias`: Categorías personalizadas para gastos
    - `movimientos`: Registro de gastos e ingresos
    - `ahorros`: Registro de ahorros
    - `inversiones`: Registro de inversiones
    - `deudas`: Registro de deudas
    - `objetivos_mensuales`: Planificación mensual de objetivos financieros

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para que los usuarios solo puedan ver y modificar sus propios datos

  3. Relaciones
    - Todas las tablas están relacionadas con la tabla usuarios
    - Movimientos pueden estar relacionados con bancos o tarjetas
    - Ahorros e inversiones relacionados con bancos
*/

-- Crear tabla de usuarios extendida
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  nombre text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de bancos
CREATE TABLE IF NOT EXISTS bancos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) NOT NULL,
  nombre text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('ahorro', 'corriente', 'inversion')),
  numero_cuenta text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de tarjetas de crédito
CREATE TABLE IF NOT EXISTS tarjetas_credito (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) NOT NULL,
  nombre text NOT NULL,
  banco text NOT NULL,
  limite decimal(12,2) NOT NULL,
  fecha_corte integer NOT NULL CHECK (fecha_corte BETWEEN 1 AND 31),
  fecha_pago integer NOT NULL CHECK (fecha_pago BETWEEN 1 AND 31),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) NOT NULL,
  nombre text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (usuario_id, nombre)
);

-- Crear tabla de movimientos (gastos e ingresos)
CREATE TABLE IF NOT EXISTS movimientos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) NOT NULL,
  fecha date NOT NULL,
  cantidad decimal(12,2) NOT NULL,
  descripcion text NOT NULL,
  categoria_id uuid REFERENCES categorias(id),
  tipo text NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
  tipo_pago text NOT NULL CHECK (tipo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
  tarjeta_id uuid REFERENCES tarjetas_credito(id),
  banco_id uuid REFERENCES bancos(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de ahorros
CREATE TABLE IF NOT EXISTS ahorros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) NOT NULL,
  fecha date NOT NULL,
  cantidad decimal(12,2) NOT NULL,
  descripcion text NOT NULL,
  tipo_ahorro text NOT NULL CHECK (tipo_ahorro IN ('efectivo', 'transferencia')),
  banco_id uuid REFERENCES bancos(id),
  meta decimal(12,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de inversiones
CREATE TABLE IF NOT EXISTS inversiones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) NOT NULL,
  fecha date NOT NULL,
  cantidad decimal(12,2) NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('acciones', 'criptomonedas', 'bienes_raices', 'otros')),
  descripcion text NOT NULL,
  tipo_pago text NOT NULL CHECK (tipo_pago IN ('efectivo', 'transferencia')),
  banco_id uuid REFERENCES bancos(id),
  retorno_esperado decimal(5,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de deudas
CREATE TABLE IF NOT EXISTS deudas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) NOT NULL,
  fecha date NOT NULL,
  cantidad decimal(12,2) NOT NULL,
  descripcion text NOT NULL,
  fecha_vencimiento date NOT NULL,
  interes decimal(5,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de objetivos mensuales
CREATE TABLE IF NOT EXISTS objetivos_mensuales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES usuarios(id) NOT NULL,
  mes integer NOT NULL CHECK (mes BETWEEN 1 AND 12),
  año integer NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('ahorro', 'gasto', 'inversion', 'deuda')),
  descripcion text NOT NULL,
  cantidad decimal(12,2) NOT NULL,
  progreso decimal(12,2) DEFAULT 0,
  completado boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE bancos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarjetas_credito ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ahorros ENABLE ROW LEVEL SECURITY;
ALTER TABLE inversiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE deudas ENABLE ROW LEVEL SECURITY;
ALTER TABLE objetivos_mensuales ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios
CREATE POLICY "Usuarios pueden ver sus propios datos"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar sus propios datos"
  ON usuarios
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Políticas de seguridad para bancos
CREATE POLICY "Usuarios pueden ver sus propios bancos"
  ON bancos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear sus propios bancos"
  ON bancos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus propios bancos"
  ON bancos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus propios bancos"
  ON bancos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Políticas de seguridad para tarjetas de crédito
CREATE POLICY "Usuarios pueden ver sus propias tarjetas"
  ON tarjetas_credito
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear sus propias tarjetas"
  ON tarjetas_credito
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus propias tarjetas"
  ON tarjetas_credito
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus propias tarjetas"
  ON tarjetas_credito
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Políticas de seguridad para categorías
CREATE POLICY "Usuarios pueden ver sus propias categorías"
  ON categorias
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear sus propias categorías"
  ON categorias
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus propias categorías"
  ON categorias
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus propias categorías"
  ON categorias
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Políticas de seguridad para movimientos
CREATE POLICY "Usuarios pueden ver sus propios movimientos"
  ON movimientos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear sus propios movimientos"
  ON movimientos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus propios movimientos"
  ON movimientos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus propios movimientos"
  ON movimientos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Políticas de seguridad para ahorros
CREATE POLICY "Usuarios pueden ver sus propios ahorros"
  ON ahorros
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear sus propios ahorros"
  ON ahorros
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus propios ahorros"
  ON ahorros
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus propios ahorros"
  ON ahorros
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Políticas de seguridad para inversiones
CREATE POLICY "Usuarios pueden ver sus propias inversiones"
  ON inversiones
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear sus propias inversiones"
  ON inversiones
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus propias inversiones"
  ON inversiones
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus propias inversiones"
  ON inversiones
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Políticas de seguridad para deudas
CREATE POLICY "Usuarios pueden ver sus propias deudas"
  ON deudas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear sus propias deudas"
  ON deudas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus propias deudas"
  ON deudas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus propias deudas"
  ON deudas
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Políticas de seguridad para objetivos mensuales
CREATE POLICY "Usuarios pueden ver sus propios objetivos"
  ON objetivos_mensuales
  FOR SELECT
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear sus propios objetivos"
  ON objetivos_mensuales
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus propios objetivos"
  ON objetivos_mensuales
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus propios objetivos"
  ON objetivos_mensuales
  FOR DELETE
  TO authenticated
  USING (auth.uid() = usuario_id);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_movimientos_usuario_fecha ON movimientos(usuario_id, fecha);
CREATE INDEX IF NOT EXISTS idx_ahorros_usuario_fecha ON ahorros(usuario_id, fecha);
CREATE INDEX IF NOT EXISTS idx_inversiones_usuario_fecha ON inversiones(usuario_id, fecha);
CREATE INDEX IF NOT EXISTS idx_deudas_usuario_fecha ON deudas(usuario_id, fecha);
CREATE INDEX IF NOT EXISTS idx_objetivos_usuario_mes_año ON objetivos_mensuales(usuario_id, mes, año);