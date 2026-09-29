ALTER TABLE recipes ADD COLUMN output_quantity INTEGER NOT NULL DEFAULT 1 CHECK (output_quantity > 0);
