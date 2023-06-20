import { Appointment, AppointmentReq } from "./model"
import { AppointmentRepository } from "./repository"

export interface AppointmentService {
    createAppointment(appointmentReq: AppointmentReq): Promise<Appointment>
    getAllAppointments(): Promise<Appointment[]>
}

export class AppointmentServiceImpl implements AppointmentService {
    private appointmentRepository: AppointmentRepository

    constructor() {
        this.appointmentRepository = new AppointmentRepository
    }

    public async createAppointment(appointmentReq: AppointmentReq): Promise<Appointment> {
        return this.appointmentRepository.createDoctor(appointmentReq)
    }
    public async getAllAppointments(): Promise<Appointment[]> {
        return this.appointmentRepository.getAllappointments()
    }
}