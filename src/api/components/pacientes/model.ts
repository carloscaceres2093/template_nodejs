export interface Patient {
    id_paciente: number
    nombre: string
    apellido: string
    identificacion: string
    telefono: number
    created_at?: string
    updated_at?: string
}

export interface PatientReq {
    nombre: string
    apellido: string
    identificacion: string
    telefono?: number
    created_at?: string
    updated_at?: string
}