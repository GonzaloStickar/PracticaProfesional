CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE reparaciones (
    id SERIAL PRIMARY KEY,
    persona_id INT REFERENCES personas(id),
    descripcion TEXT,
    tipo VARCHAR(50),
    fecha DATE,
    estado VARCHAR(20)
);