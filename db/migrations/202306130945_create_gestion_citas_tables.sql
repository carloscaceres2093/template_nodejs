-- 202306130945_create_gestion_citas_tables.sql
CREATE TABLE IF NOT EXISTS doctores (
    id_doctor bigserial,
    nombre VARCHAR, 
    apellido VARCHAR, 
    especialidad VARCHAR,
    consultorio VARCHAR,
    correo VARCHAR,
    created_at timestamptz,
    updated_at timestamptz,
    PRIMARY key(id_doctor)
);

CREATE TABLE IF NOT EXISTS pacientes (
    id_paciente bigserial,
    nombre VARCHAR, 
    apellido VARCHAR, 
    identificacion VARCHAR,
    telefono INT,
    created_at timestamptz,
    updated_at timestamptz,
    PRIMARY key(id_paciente)
);

CREATE TABLE IF NOT EXISTS citas (
    id_cita bigserial,
    horario VARCHAR,
    especialidad VARCHAR,
    id_doctor BIGINT,
    identificacion_paciente VARCHAR,
    created_at timestamptz,
    updated_at timestamptz,
    PRIMARY key(id_cita),
    CONSTRAINT fk_doctores
    FOREIGN KEY (id_doctor)
    REFERENCES doctores(id_doctor),
    CONSTRAINT fk_pacientes
    FOREIGN KEY (identificacion_paciente)
    REFERENCES pacientes(identificacion)
);
