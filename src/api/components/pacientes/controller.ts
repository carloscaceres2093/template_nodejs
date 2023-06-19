import { Patient, PatientReq } from './model'
import { Request, Response } from 'express'
import { PatientService } from './service'
import logger from '../../../utils/logger'
import { isEmpty } from "class-validator"


export interface PatientController {
    getPatient(req: Request, res: Response): Promise<void>
    createPatient(req: Request, res: Response): Promise<void>
}

export class PatientControllerImpl implements PatientController {
    private patientService: PatientService

    constructor(patientService: PatientService) {
        this.patientService = patientService
    }

    private validarObjeto(objeto: any, res: Response): objeto is PatientReq {

        if (isEmpty(objeto.nombre)) {
            const msg = `message: el campo nombre es obligatorio`
            logger.error(msg)
            res.status(400).json({ msg })
            return false;
        } else if (isEmpty(objeto.apellido)) {
            const msg = `message: el campo apellido es obligatorio`
            logger.error(msg)
            res.status(400).json({ msg })
            return false;
        } else if (isEmpty(objeto.identificacion)) {
            const msg = `message: el campo identificacion es obligatorio`
            logger.error(msg)
            res.status(400).json({ msg })
            return false;
        } else if (isEmpty(objeto.telefono)) {
            const msg = `message: el campo telefono es obligatorio`
            logger.error(msg)
            res.status(400).json({ msg })
            return false;
        } else {
            logger.info(`message: todos los campos obligatorios existen`)
            return true
        }
    }

    private limpiarObjeto(patientReq: PatientReq): Object {
        const keys: Array<keyof PatientReq> = Object.keys(patientReq) as Array<keyof PatientReq>;
        const llavesInterfaz: Array<keyof PatientReq> = ['nombre', 'apellido', 'identificacion', 'telefono'];

        for (const key of keys) {
            if (!llavesInterfaz.includes(key)) {
                patientReq = {
                    nombre: patientReq.nombre,
                    apellido: patientReq.apellido,
                    identificacion: patientReq.identificacion,
                    telefono: patientReq.telefono
                }
            }
        }
        return patientReq
    }

    public async getPatient(req: Request, res: Response): Promise<void> {
        let patientReq = req.body
        const keys: Array<keyof PatientReq> = Object.keys(patientReq) as Array<keyof PatientReq>;
        const llavesInterfaz: Array<keyof PatientReq> = ['identificacion'];

        for (const key of keys) {
            if (!llavesInterfaz.includes(key)) {
                patientReq = {
                    identificacion: patientReq.identificacion
                }
            }
        }
        if (isEmpty(patientReq.identificacion)) {
            const msg = `message: el campo identificacion es obligatorio`
            logger.error(msg)
            res.status(400).json({ msg })
        } else {
            try {
                const patient = await this.patientService.getPatient(patientReq.identificacion)
                res.json(patient)
            } catch (error) {
                logger.error(error)
                res.status(400).json({
                    message: "Error consultando paciente."
                })
            }
        }
    }
    public async createPatient(req: Request, res: Response): Promise<void> {
        const patientReq = this.limpiarObjeto(req.body)
        if (this.validarObjeto(patientReq, res)) {
            try {
                const createPatient: Patient = await this.patientService.createPatient(patientReq)
                res.status(201).json(createPatient)
            } catch (error) {
                logger.error(error)
                res.status(400).json({
                    message: "Error creando paciente."
                })
            }
        }
    }
}