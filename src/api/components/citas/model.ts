export interface Appointment {
    id_cita: number
    horario: string
    id_doctor: number
    identificacion_paciente: string
    especialidad: string
    doctor: string
    consultorio: number
    createdAt?: Date
    updatedAt?: Date
}

export interface AppointmentReq {
    horario: string
    id_doctor: number
    identificacion_paciente: string
    especialidad: string
    doctor: string
    consultorio: number
}

export interface AppointmentResDB {
    id_cita: number
    horario: string
    especialidad: string
    id_doctor: number
    identificacion_paciente: string
    created_at: string
    updated_at: string
}