CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,                     
    nombre_completo VARCHAR(100),              
    foto_url VARCHAR(600) UNIQUE NOT NULL,     
    edad INTEGER NOT NULL,                     
    habitacion VARCHAR(100) NOT NULL,          
    diagnostico VARCHAR(100) NOT NULL,         
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    activo BOOLEAN NOT NULL                    
);

SELECT * FROM pacientes;