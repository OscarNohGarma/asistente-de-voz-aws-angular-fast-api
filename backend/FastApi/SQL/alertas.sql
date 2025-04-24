CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,
    id_pacientes VARCHAR(100),
    tipo VARCHAR(100) UNIQUE,
    hora VARCHAR(100) UNIQUE,
    estado VARCHAR(100) NOT NULL,
    confirmada_por VARCHAR(100),
    fecha_confirmacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM alertas;
