CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(90) NOT NULL,
  password VARCHAR(90) NOT NULL
);

INSERT INTO "user" (id,name,password) VALUES (1,'admin','admin') ON CONFLICT DO UPDATE;