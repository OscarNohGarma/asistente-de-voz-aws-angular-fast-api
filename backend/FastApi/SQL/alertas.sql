CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,
    id_pacientes VARCHAR(100),
    tipo VARCHAR(100),
    hora VARCHAR(100),
    estado VARCHAR(100) NOT NULL DEFAULT 'pendiente',
    confirmada_por VARCHAR(100),
    fecha_confirmacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nueva BOOLEAN NOT NULL DEFAULT TRUE,
    palabras_clave TEXT[]
);
