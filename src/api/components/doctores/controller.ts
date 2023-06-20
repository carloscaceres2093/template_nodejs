import { Doctor } from './model'
import { Request, Response } from 'express'
import { DoctorService } from './service'
import logger from '../../../utils/logger'


export interface DoctorController {
    getAllDoctors(req: Request, res: Response): void
    createDoctor(req: Request, res: Response): void    
}

export class DoctorControllerImpl implements DoctorController {
    private  doctorService:  DoctorService
    
    constructor ( doctorService: DoctorService ){
        this.doctorService = doctorService
    }
    public  async getAllDoctors(req: Request, res: Response): Promise<void> {
        try {
            const doctors = await this.doctorService.getAllDoctors()
            res.json(doctors)
            
        } catch (error) {
            logger.error(error)
            res.status(400).json({message: "Error getting all doctors"})
        }
    }
    public  createDoctor (req: Request, res: Response): void {
        const doctorReq = req.body
        try {
            this.doctorService.createDoctor(doctorReq)
            .then(
                (doctor) =>{
                    res.status(201).json(doctor)
                },
                (error) =>{
                    console.log(error)
                    res.status(400).json({message: "Esto es el reject"})
                }
            )
        } catch (error) {
            logger.error(error)
            res.status(400).json({message: "Error creating doctor"})
        }
    }
}