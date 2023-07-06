import { Patient, PatientReq } from './model'
import { Request, Response } from 'express'
import { PatientService } from './service'
import logger from '../../../utils/logger'
import { DoctorCreationError, PatientUpdateError, RecordNotFoundError } from '../../../utils/customErrors'
import { createPatientSchema, updatePatientSchema } from './validations/pacientes.validations'


export interface PatientController {
    getAllPatient(req: Request, res: Response): void
    createPatient(req: Request, res: Response): void
    getPatientById(req: Request, res: Response): void
    updatePatient(req: Request, res: Response): void
    deletePatient(req: Request, res: Response): void
}

export class PatientControllerImpl implements PatientController {
    private patientService: PatientService

    constructor(patientService: PatientService) {
        this.patientService = patientService
    }

    public updatePatient(req: Request, res: Response): void {
        const id = parseInt(req.params.id)
        const { error, value } = updatePatientSchema.validate(req.body)
        if (error) {
            res.status(400).json({ message: error.details[0].message })
        } else {
            this.patientService.updatePatient(id, value)
                .then(
                    (patient) => {
                        res.status(201).json(patient)
                    },
                    (error) => {
                        logger.error(error)
                        if (error instanceof RecordNotFoundError) {
                            res.status(400).json({
                                error_name: error.name,
                                message: "Failed Creating patient"
                            })
                        }
                        if (error instanceof PatientUpdateError) {
                            res.status(400).json({
                                error_name: error.name,
                                message: "Failed Creating patient"
                            })
                        } else {
                            console.log(error)
                            res.status(400).json({
                                message: "Internal Server Error"
                            })
                        }
                    }
                )
        }
    }

    public async getAllPatient(req: Request, res: Response): Promise<void> {
        try {
            const patients = await this.patientService.getAllPatients()
            res.status(200).json(patients)

        } catch (error) {
            res.status(400).json({ message: "Error getting all patients" })
        }
    }
    public createPatient(req: Request, res: Response): void {
        const patientReq = req.body
        this.patientService.createPatient(patientReq)
            .then(
                (patient) => {
                    res.status(201).json(patient)
                },
                (error) => {
                    logger.error(error)
                    if (error instanceof DoctorCreationError) {
                        res.status(400).json({
                            error_name: error.name,
                            message: "Failed Creating a patient"
                        })
                    } else {
                        res.status(400).json({
                            message: "Internal Server Error"
                        })
                    }
                }
            )

    }

    public async getPatientById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id)
            if (isNaN(id)) {
                throw new Error("Id must be a number")
            }
            const patient = await this.patientService.getPatientById(id)
            if (patient) {
                res.status(200).json(patient)
            } else {
                throw new RecordNotFoundError()
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof RecordNotFoundError) {
                res.status(400).json({ error: error.message })
            } else {
                res.status(400).json({ error: "Failed to retrieve patient" })
            }
        }
    }
    public async deletePatient(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id)
            await this.patientService.deletePatient(id)
            res.status(200).json({ message: `Patient was deleted successfully` })
        } catch (error) {
            logger.error('Failed to delete patient from controller' + error)
            if (error instanceof RecordNotFoundError) {
                res.status(400).json({ error: error.message })
            } else {
                res.status(400).json({ error: "Failed to delete patient" })
            }
        }
    }

}