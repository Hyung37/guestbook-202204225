CREATE TABLE IF NOT EXISTS entries (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 20),
  message       TEXT        NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS entries_created_at_id_idx ON entries (created_at DESC, id DESC);
