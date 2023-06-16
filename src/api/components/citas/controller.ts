import { Appointment } from './model'
import { Request, Response } from 'express'
import { AppointmentService } from './service'


export interface AppointmentController {
    createAppointment(req: Request, res: Response): void 
    getAllAppointments(req: Request, res: Response): void    
}

export class AppointmentControllerImpl implements AppointmentController {
    private  appointmentService:  AppointmentService
    
    constructor ( appointmentService: AppointmentService ){
        this.appointmentService = appointmentService
    }
    public createAppointment(req: Request, res: Response): void {
        const appointment: Appointment |null = this.appointmentService.createAppointment()
        res.json(appointment)
    }
    public getAllAppointments(req: Request, res: Response): void {
        const appointments: Appointment [] = this.appointmentService.getAllAppointments()
        res.json(appointments)
    }

}