-- Infrastructure migration: proves remote D1 connectivity and establishes timestamps.
CREATE TABLE IF NOT EXISTS schema_metadata (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO schema_metadata (key, value) VALUES ('schema_version', '0001');

