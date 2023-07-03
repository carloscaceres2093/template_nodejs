export interface Doctor {
    id_doctor: number,
    nombre: string,
    apellido: string,
    especialidad: string,
    consultorio: number,
    correo?: string,
    created_at?: string
    updated_at?: string
}

export interface DoctorReq {
    nombre: string,
    apellido: string,
    especialidad: string,
    consultorio: number,
    correo?: string
    created_at?: string
    updated_at?: string
}
