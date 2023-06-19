import logger from "../../../utils/logger"
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

    public async getAllDoctors(req: Request, res: Response): Promise<void> {
        try {
            const doctors = await this.doctorService.getAllDoctors()
            res.json(doctors)
        } catch (error) {
            logger.error(error)
            res.status(400).json({
                message: "Error consultando doctor."
            })
        }
    }
    public async createDoctor(req: Request, res: Response): Promise<void> {
        const doctorReq = req.body
        try {
            const createDoctor: Doctor = await this.doctorService.createDoctor(doctorReq)
            res.status(201).json(createDoctor)
        } catch (error) {
            logger.error(error)
            res.status(400).json({
                message: "Error creando doctor."
            })
        }
    }
}