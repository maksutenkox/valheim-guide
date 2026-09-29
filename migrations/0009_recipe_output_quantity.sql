-- output_quantity is added idempotently by ensureCatalogSchema in the Worker.
-- Keeping this migration as a no-op avoids a duplicate-column failure if the
-- production database has already been upgraded lazily by the deployed Worker.
SELECT 1;
