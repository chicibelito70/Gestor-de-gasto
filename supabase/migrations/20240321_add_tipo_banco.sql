-- Agregar campo tipo a la tabla bancos
ALTER TABLE bancos ADD COLUMN tipo VARCHAR(10) NOT NULL DEFAULT 'debito' CHECK (tipo IN ('debito', 'credito')); 