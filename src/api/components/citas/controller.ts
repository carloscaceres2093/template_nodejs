import { Request, Response } from 'express'
import { AppointmentService } from './service'
import logger from '../../../utils/logger'
import { DoctorCreationError, AppointmentUpdateError, RecordNotFoundError, AppoinmentCreateError } from '../../../config/customErrors'
import { createAppointmentSchema, updateAppointmentSchema } from './validations/citas.validations'


export interface AppointmentController {
    getAllAppointment(req: Request, res: Response): void
    createAppointment(req: Request, res: Response): void
    getAppointmentById(req: Request, res: Response): void
    updateAppointment(req: Request, res: Response): void
}

export class AppointmentControllerImpl implements AppointmentController {
    private appointmentService: AppointmentService

    constructor(appointmentService: AppointmentService) {
        this.appointmentService = appointmentService
    }
    public updateAppointment(req: Request, res: Response): void {
        const id = parseInt(req.params.id)
        const { error, value } = updateAppointmentSchema.validate(req.body)
        if (error) {
            res.status(400).json({ message: error.details[0].message })
        } else {
            this.appointmentService.updateAppointment(id, value)
                .then(
                    (appointment) => {
                        res.status(201).json(appointment)
                    },
                    (error) => {
                        logger.error(error)
                        if (error instanceof RecordNotFoundError) {
                            res.status(400).json({
                                error_name: error.name,
                                message: "Failed Creating appointment"
                            })
                        }
                        if (error instanceof AppointmentUpdateError) {
                            res.status(400).json({
                                error_name: error.name,
                                message: "Failed Creating appointment"
                            })
                        } else {
                            res.status(400).json({
                                message: "Internal Server Error"
                            })
                        }
                    }
                )
        }
    }
    public async getAllAppointment(req: Request, res: Response): Promise<void> {
        try {
            const patients = await this.appointmentService.getAllAppointments()

            res.status(200).json(patients)

        } catch (error) {
            logger.error(error)
            res.status(400).json({ message: "Error getting all appointments" })
        }
    }
    public createAppointment(req: Request, res: Response): void {
        const { error, value } = createAppointmentSchema.validate(req.body)
        if (error) {
            res.status(400).json({ message: error.details[0].message })
        } else {
            this.appointmentService.createAppointment(value)
                .then(
                    (appointment) => {
                        res.status(201).json(appointment)
                    },
                    (error) => {
                        logger.error(error)
                        if (error instanceof AppoinmentCreateError) {
                            res.status(400).json({
                                error_name: error.name,
                                message: "Failed Creating appointment"
                            })
                        } else {
                            res.status(400).json({
                                message: "Internal Server Error"
                            })
                        }
                    }
                )
        }
    }

    public async getAppointmentById(req: Request, res: Response): Promise<void> {
        try {

            const id = parseInt(req.params.id)
            if (isNaN(id)) {
                throw new Error("Id must be a number")
            }
            const appointment = await this.appointmentService.getAppointmentById(id)
            if (appointment) {
                res.status(200).json(appointment)
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

}