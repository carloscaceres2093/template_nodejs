import { Request, Response } from 'express'
import { AppointmentService } from './service'
import logger from '../../../utils/logger'
import { DoctorCreationError, AppointmentUpdateError, RecordNotFoundError, AppoinmentCreateError, AppointmentDeleteError } from '../../../utils/customErrors'
import { createAppointmentSchema, updateAppointmentSchema } from './validations/citas.validations'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'


export interface AppointmentController {
    getAllAppointment(req: Request, res: Response): void
    createAppointment(req: Request, res: Response): void
    getAppointmentById(req: Request, res: Response): void
    updateAppointment(req: Request, res: Response): void
    deleteAppointment(req: Request, res: Response): void
}

export class AppointmentControllerImpl implements AppointmentController {
    private appointmentService: AppointmentService

    constructor(appointmentService: AppointmentService) {
        this.appointmentService = appointmentService
    }
    public async updateAppointment(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id)
        const { error, value } = updateAppointmentSchema.validate(req.body)
        if (error) {
            res.status(400).json({ message: error.details[0].message })
        } else {
            try {
                const appointment = await this.appointmentService.updateAppointment(id, value)
                res.status(201).json(appointment)
            } catch (error) {
                logger.error(error)
                if (error instanceof RecordNotFoundError) {
                    res.status(400).json({
                        error_name: error.name,
                        message: "Failed Updating appointment"
                    })
                }
                if (error instanceof AppointmentUpdateError) {
                    res.status(400).json({
                        error_name: error.name,
                        message: "Failed Updating appointment"
                    })
                } else {
                    res.status(400).json({
                        message: "Internal Server Error"
                    })
                }
            }
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
    public async createAppointment(req: Request, res: Response): Promise<void> {
        const { error, value } = createAppointmentSchema.validate(req.body)
        if (error) {
            res.status(400).json({ message: error.details[0].message })
        } else {
            try {
                const appointment = await this.appointmentService.createAppointment(value)
                res.status(201).json(appointment)
            } catch (error) {
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
                res.status(400).json({ error: "Failed to retrieve appointment" })
            }
        }
    }

    public async deleteAppointment(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id)
            await this.appointmentService.deleteAppoinmentById(id)
            res.status(200).json({ message: `Appointment was deleted successfully` })
        } catch (error) {
            logger.error(error)
            if (error instanceof AppointmentDeleteError) {
                res.status(400).json({
                    error_name: error.name,
                    message: error.message
                })
            } else {
                res.status(400).json({ error: 'Failed to delete appointment' })
            }
        }
    }

}