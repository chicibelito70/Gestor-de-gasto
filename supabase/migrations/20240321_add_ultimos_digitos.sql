-- Agregar columna ultimos_digitos a la tabla tarjetas_credito
ALTER TABLE tarjetas_credito ADD COLUMN ultimos_digitos VARCHAR(4);

-- Agregar columna ultimos_digitos a la tabla bancos
ALTER TABLE bancos ADD COLUMN ultimos_digitos VARCHAR(4); 

-- Agregar campo tipo a la tabla bancos
ALTER TABLE bancos ADD COLUMN tipo VARCHAR(10) NOT NULL DEFAULT 'debito' CHECK (tipo IN ('debito', 'credito'));