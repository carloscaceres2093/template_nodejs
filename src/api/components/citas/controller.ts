import { Appointment, AppointmentReq } from './model'
import { Request, Response } from 'express'
import { AppointmentService } from './service'
import logger from '../../../utils/logger'
import { isEmpty } from "class-validator"


export interface AppointmentController {
    createAppointment(req: Request, res: Response): Promise<void>
    getAllAppointments(req: Request, res: Response): Promise<void>
}

export class AppointmentControllerImpl implements AppointmentController {
    private appointmentService: AppointmentService

    constructor(appointmentService: AppointmentService) {
        this.appointmentService = appointmentService
    }

    private validarObjeto(objeto: any, res: Response): objeto is AppointmentReq {

        if (isEmpty(objeto.identificacion_paciente)) {
            const msg = `message: el campo identificacion_paciente es obligatorio`
            logger.error(msg)
            res.status(400).json({ msg })
            return false;
        } else if (isEmpty(objeto.especialidad)) {
            const msg = `message: el campo especialidad es obligatorio`
            logger.error(msg)
            res.status(400).json({ msg })
            return false;
        } else if (isEmpty(objeto.horario)) {
            const msg = `message: el campo horario es obligatorio`
            logger.error(msg)
            res.status(400).json({ msg })
            return false;
        } else if (isEmpty(objeto.id_doctor)) {
            const msg = `message: el campo id_doctor es obligatorio`
            logger.error(msg)
            res.status(400).json({ msg })
            return false;
        } else {
            logger.info(`message: todos los campos obligatorios existen`)
            return true
        }
    }

    private limpiarObjeto(appointmentReq: AppointmentReq): Object {
        const keys: Array<keyof AppointmentReq> = Object.keys(appointmentReq) as Array<keyof AppointmentReq>;
        const llavesInterfaz: Array<keyof AppointmentReq> = ['horario', 'id_doctor', 'identificacion_paciente', 'especialidad'];

        for (const key of keys) {
            if (!llavesInterfaz.includes(key)) {
                appointmentReq = {
                    horario: appointmentReq.horario,
                    id_doctor: appointmentReq.id_doctor,
                    identificacion_paciente: appointmentReq.identificacion_paciente,
                    especialidad: appointmentReq.especialidad
                }
            }
        }
        return appointmentReq
    }

    public async createAppointment(req: Request, res: Response): Promise<void> {
        const appointmentReq = this.limpiarObjeto(req.body)
        if (this.validarObjeto(appointmentReq, res)) {
            try {
                const createdAppointment: Appointment = await this.appointmentService.createAppointment(appointmentReq)
                res.status(201).json(createdAppointment)
            } catch (error) {
                logger.error(error)
                res.status(400).json({
                    message: "Error creando cita."
                })
            }
        }
    }
    public async getAllAppointments(req: Request, res: Response): Promise<void> {
        try {
            const appointments = await this.appointmentService.getAllAppointments()
            res.json(appointments)
        } catch (error) {
            logger.error(error)
            res.status(400).json({
                message: "Error consultando citas."
            })
        }
    }

}