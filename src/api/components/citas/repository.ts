import { db } from "../../../config/database"
import { Appointment, AppointmentReq, AppointmentResDB } from "./model"
import logger from '../../../utils/logger'
import { RecordNotFoundError, GetAllError, AppointmentUpdateError, AppoinmentCreateError, AppointmentDeleteError, AllAppointmentGetError } from "../../../utils/customErrors"

export class AppointmentRepository {

    public async updateAppointment(id: number, updateAppointment: Partial<AppointmentReq>): Promise<AppointmentResDB> {
        try {
            updateAppointment.updated_at = new Date().toISOString()
            const [updatedAppointment] = await db('citas').where({ id_cita: id }).update(updateAppointment).returning('*')
            return updatedAppointment
        } catch (error) {
            logger.error('Failed updated appointment in repository', { error })
            throw new AppointmentUpdateError()
        }
    }

    public async createAppointment(appointment: AppointmentReq): Promise<AppointmentResDB> {
        try {
            appointment.created_at = new Date().toISOString()
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
            return await db.select('*').from('citas')
        } catch (error) {
            throw new AllAppointmentGetError()
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

    public async deleteAppointmentById(id: number): Promise<void> {
        try {
            await db('citas').where({ id_cita: id }).del()
        } catch (error) {
            logger.error('Failed delete appointment by id in repository' + error)
            throw new AppointmentDeleteError()
        }
    }

    public async deleteAllAppointmentsByPatientNumberId(id: string): Promise<void> {
        try {
            await db('citas').where({ identificacion_paciente: id }).del()
        } catch (error) {
            logger.error('Failed delete appointment by patient number id in repository' + error)
            throw new AppointmentDeleteError()
        }
    }
}