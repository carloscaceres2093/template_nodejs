import { Doctor } from './model'
import { Request, Response } from 'express'
import { DoctorService } from './service'

export interface DoctorController {
    getAllDoctors(req: Request, res: Response): void
    createDoctor(req: Request, res: Response): void    
}

export class DoctorControllerImpl implements DoctorController {
    private doctorService: DoctorService
    
    constructor(doctorService: DoctorService) {
        this.doctorService = doctorService
    }
    
    public getAllDoctors(req: Request, res: Response): void {
        const doctors: Doctor[] = this.doctorService.getAllDoctors()
        res.json(doctors)
    }
    
    public createDoctor(req: Request, res: Response): void {
        const doctorReq: Doctor = req.body as Doctor // Obtener el objeto doctorReq del cuerpo de la solicitud
        const doctor: Doctor = this.doctorService.createDoctor(doctorReq) // Pasar el objeto doctorReq al método createDoctor
        res.json(doctor)
    }
}
