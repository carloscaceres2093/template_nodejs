import { Patient } from './model'
import { Request, Response } from 'express'
import { PatientService } from './service'


export interface PatientController {
    getPatient(req: Request, res: Response): void
    createPatient(req: Request, res: Response): void    
}

export class PatientControllerImpl implements PatientController {
    private  patientService:  PatientService
    
    constructor ( patientService: PatientService ){
        this.patientService = patientService
    }
    public getPatient(req: Request, res: Response): void {
        const patient: Patient|null = this.patientService.getPatient()
        res.json(patient)
    }
    public createPatient (req: Request, res: Response): void {
        const patient: Patient|null = this.patientService.createPatient()
        res.json(patient)
    }
}