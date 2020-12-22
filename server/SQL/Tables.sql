--- TODO: I think this can be safely removed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--- Needed for pivot functions
CREATE EXTENSION IF NOT EXISTS tablefunc;

CREATE TABLE IF NOT EXISTS environments (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sensors (
	id SERIAL PRIMARY KEY,
	environment INTEGER NOT NULL REFERENCES environments ON DELETE CASCADE,
	name TEXT NOT NULL,
	description TEXT NOT NULL
);
ALTER TABLE sensors ADD COLUMN IF NOT EXISTS data_type TEXT;
ALTER TABLE sensors ADD COLUMN IF NOT EXISTS data_type_name TEXT;
ALTER TABLE sensors ADD COLUMN IF NOT EXISTS ui_color TEXT;

CREATE TABLE IF NOT EXISTS reading (
	id BIGSERIAL PRIMARY KEY,
	sensor INTEGER NOT NULL REFERENCES sensors ON DELETE CASCADE,
	taken_on TIMESTAMP NOT NULL DEFAULT current_timestamp,
	value TEXT NOT NULL
);
-- Pagination index
CREATE INDEX IF NOT EXISTS r_idx ON reading USING btree (id);

CREATE TABLE IF NOT EXISTS environment_tokens (
	environment INTEGER NOT NULL REFERENCES environments ON DELETE CASCADE,
	secret TEXT
);

CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	last_login TIMESTAMP,
	curr_token TEXT
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS token_expiry TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS salt TEXT;

CREATE TABLE IF NOT EXISTS images (
	id BIGSERIAL PRIMARY KEY,
	mimetype TEXT NOT NULL,
	filename TEXT NOT NULL,
	uploaded_on TIMESTAMP DEFAULT current_timestamp,
	environment INTEGER REFERENCES environments,
	filedata BYTEA NOT NULL
);