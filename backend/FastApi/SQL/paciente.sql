CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,                     
    nombre_completo VARCHAR(100),              
    foto_url VARCHAR(255),  -- El nombre del archivo o la ruta relativa de la foto    
    edad INTEGER NOT NULL,                     
    habitacion VARCHAR(100) NOT NULL,          
    diagnostico VARCHAR(100) NOT NULL,         
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    activo BOOLEAN NOT NULL,
    telefono_familiar VARCHAR(20),             -- Campo opcional
    correo_familiar VARCHAR(100),               -- Campo opcional                
    embedding TEXT,
);

SELECT * FROM pacientes;