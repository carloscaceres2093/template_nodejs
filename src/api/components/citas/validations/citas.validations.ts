import Joi from 'joi'
import { Especialidad } from '../../../../utils/model'

const createAppointmentSchema = Joi.object({
    horario: Joi.string().required(),
    id_doctor: Joi.number().required(),
    especialidad: Joi.string().valid(...Object.values(Especialidad)).required(),
    identificacion_paciente: Joi.string().required(),
})

export { createAppointmentSchema }