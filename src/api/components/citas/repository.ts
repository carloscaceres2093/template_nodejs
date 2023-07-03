import { db } from "../../../config/database"
import { Appointment, AppointmentReq, AppointmentResDB } from "./model"
import logger from '../../../utils/logger'
import { DoctorCreationError, RecordNotFoundError, GetAllError, AppointmentUpdateError, AppoinmentCreateError } from "../../../config/customErrors"

export class AppointmentRepository {

    public async updateAppointment(id: number, updateAppointment: Partial<AppointmentReq>): Promise<AppointmentResDB> {
        try {
            const [updatedAppointment] = await db('citas').where({ id_cita: id }).update(updateAppointment).returning('*')
            return updatedAppointment
        } catch (error) {
            logger.error('Failed updated appointment in repository', { error })
            throw new AppointmentUpdateError()
        }
    }

    public async createAppointment(appointment: AppointmentReq): Promise<AppointmentResDB> {
        try {
            const [createdAppointment] = await db('citas').insert(appointment).returning('*')
            return createdAppointment
        } catch (error) {
            console.log(error)
            logger.error('Failed to create appointment dubt: ', error)
            throw new AppoinmentCreateError()
        }
    }

    public async getAllAppointment(): Promise<Appointment[]> {
        try {
            return db.select('*').from('citas')
        } catch (error) {

            throw new GetAllError("Failed getting all appointments from repository", "appointment")
        }
    }

    public async getAppointmentById(id: number): Promise<AppointmentResDB> {
        try {
            const appointment = await db('citas').where({ id_cita: id }).first()
            return appointment
        } catch (error) {
            logger.error('Failed get appointment by id in repository', { error })
            throw new RecordNotFoundError()
        }
    }
}