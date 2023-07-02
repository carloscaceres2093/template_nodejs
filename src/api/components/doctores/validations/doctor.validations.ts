import Joi from 'joi'
import { DoctorReq } from '../model'
import { Especialidad } from '../../../../utils/model'

const createDoctorSchema = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string(),
    especialidad: Joi.string().valid(...Object.values(Especialidad)).required(),
    consultorio: Joi.number().integer().min(100).max(999).required(),
    correo: Joi.string()
})

export { createDoctorSchema }