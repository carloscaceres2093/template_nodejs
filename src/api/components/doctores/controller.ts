import { Doctor } from "./model"
import { DoctorService, DoctorServiceImpl } from "./service"
import { Request, Response } from "express"

export interface DoctorController {
    getAllDoctors(req: Request, res: Response): void
    createDoctor(req: Request, res: Response): void
}

export class DoctorControllerImpl implements DoctorController {

    private doctorService: DoctorService

    constructor(doctorService: DoctorService) {
        this.doctorService = doctorService
    }

    getAllDoctors(req: Request, res: Response): void {
        const doctors: Doctor[] = this.doctorService.getAllDoctors()
        res.json(doctors)
    }
    createDoctor(req: Request, res: Response): void {
        const createDoctor: Doctor = this.doctorService.createDoctor()
        res.json(createDoctor)
    }

}