import Joi from 'joi'
import { Especialidad } from '../../../../utils/model'

const createAppointmentSchema = Joi.object({
    horario: Joi.string().required(),
    id_doctor: Joi.number().required(),
    especialidad: Joi.string().valid(...Object.values(Especialidad)).required(),
    identificacion_paciente: Joi.string().required(),
})

const updateAppointmentSchema = Joi.object({
    horario: Joi.string(),
    id_doctor: Joi.number(),
    especialidad: Joi.string().valid(...Object.values(Especialidad)),
    identificacion_paciente: Joi.string()
})

export {
    createAppointmentSchema,
    updateAppointmentSchema
}