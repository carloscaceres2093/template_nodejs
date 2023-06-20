export interface Appointment {
    id_cita: number
    horario: string
    id_doctor: number
    identificacion_paciente: string
    especialidad: string
    createdAt?: Date
    updatedAt?: Date
}

export interface AppointmentReq {
    horario: string
    id_doctor: number
    identificacion_paciente: string
    especialidad: string
}