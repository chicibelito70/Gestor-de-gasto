-- Agregar campo permite_transferencias a la tabla bancos
ALTER TABLE bancos ADD COLUMN permite_transferencias BOOLEAN NOT NULL DEFAULT true; 