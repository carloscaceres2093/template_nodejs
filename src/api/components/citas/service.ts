import { Appointment } from "./model"

export interface AppointmentService {
    createAppointment(): Appointment | null 
    getAllAppointments(): Appointment[]
}

export class AppointmentServiceImpl implements AppointmentService {
    
    public createAppointment(): Appointment | null {
        return null
    }
    public getAllAppointments(): Appointment[] {
        return []
    }
}