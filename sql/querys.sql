CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255)
);

CREATE TABLE materiales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ancho_cm NUMERIC(10,2),
    alto_cm NUMERIC(10,2),
    coste NUMERIC(10,2) NOT NULL,
    merma_porcentaje NUMERIC(5,2),
    ultima_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE config_global (
    id SERIAL PRIMARY KEY,
    mano_obra NUMERIC(10,2),
    iva NUMERIC(5,2),
    limpieza NUMERIC(10,2),
    mascara NUMERIC(10,4),
    pintura NUMERIC(10,4),
    tiempo_corte NUMERIC(10,2)
);

CREATE TABLE config_global_xerox (
id SERIAL NOT NULL,
plastificado NUMERIC(5,2),
grapado NUMERIC(5,2),
coste_grapado NUMERIC(5,2)
)
CREATE TABLE papel (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(100),
	precio_papel NUMERIC(5,2),
	precio_copia NUMERIC(5,2),
	plastificado NUMERIC(5,2),
	blanco_negro NUMERIC(5,2),
	color NUMERIC(5,2)
);
INSERT INTO config_global (
    mano_obra, iva, limpieza, mascara, pintura, tiempo_corte
)
VALUES (10, 21, 2, 0.05, 0.03, 5);

drop table config_global_xerox
INSERT INTO config_global_xerox (plastificado,grapado,coste_grapado)
VALUES (0,0,0);
INSERT INTO users (email, location)
VALUES ('elgrut67@gmail.com', 'huelva');
DROP TABLE materiales;
SELECT * FROM materiales;
SELECT * FROM config_global_xerox;
SELECT * FROM users;
SELECT * FROM papel;
ALTER TABLE coste_pintura_cm RENAME TO coste_pintura;
ALTER TABLE users ADD COLUMN rol TEXT DEFAULT 'user';
UPDATE users SET rol = 'admin' WHERE email = 'elgrut67@gmail.com';