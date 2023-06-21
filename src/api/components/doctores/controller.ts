import { isEmpty } from "class-validator"
import logger from "../../../utils/logger"
import { Doctor, DoctorReq } from "./model"
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

    private validarObjeto(objeto: any, res: Response): objeto is DoctorReq {

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
        } else if (isEmpty(objeto.especialidad)) {
            const msg = `message: el campo especialidad es obligatorio`
            logger.error(msg)
            res.status(400).json({ msg })
            return false;
        } else if (isEmpty(objeto.consultorio)) {
            const msg = `message: el campo consultorio es obligatorio`
            logger.error(msg)
            res.status(400).json({ msg })
            return false;
        } else {
            logger.info(`message: todos los campos obligatorios existen`)
            return true
        }
    }

    private limpiarObjeto(doctorReq: DoctorReq): Object {
        const keys: Array<keyof DoctorReq> = Object.keys(doctorReq) as Array<keyof DoctorReq>;
        const llavesInterfaz: Array<keyof DoctorReq> = ['nombre', 'apellido', 'consultorio', 'especialidad', 'correo'];

        for (const key of keys) {
            if (!llavesInterfaz.includes(key)) {
                if (isEmpty(doctorReq.correo)) {
                    doctorReq = {
                        nombre: doctorReq.nombre,
                        apellido: doctorReq.apellido,
                        consultorio: doctorReq.consultorio,
                        especialidad: doctorReq.especialidad
                    }
                } else {
                    doctorReq = {
                        nombre: doctorReq.nombre,
                        apellido: doctorReq.apellido,
                        consultorio: doctorReq.consultorio,
                        especialidad: doctorReq.especialidad,
                        correo: doctorReq.correo
                    }
                }
            }
        }
        return doctorReq
    }

    public async getAllDoctors(req: Request, res: Response): Promise<void> {
        try {
            const doctors = await this.doctorService.getAllDoctors()
            res.status(200).json(doctors)
        } catch (error) {
            logger.error(error)
            res.status(400).json({
                message: "Error consultando doctor."
            })
        }
    }
    public async createDoctor(req: Request, res: Response): Promise<void> {
        const doctorReq = this.limpiarObjeto(req.body)
        if (this.validarObjeto(doctorReq, res)) {
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
}