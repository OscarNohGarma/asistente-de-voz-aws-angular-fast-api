CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,
    id_paciente VARCHAR(100),
    tipo VARCHAR(100),
    estado VARCHAR(100) NOT NULL DEFAULT 'pendiente',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nueva BOOLEAN NOT NULL DEFAULT TRUE,
    palabras_clave TEXT[]
);
