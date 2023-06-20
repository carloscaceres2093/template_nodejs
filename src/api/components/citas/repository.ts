import { db } from '../../../config/database'
import { Appointment, AppointmentReq } from './model'

export class AppointmentRepository {
    public async createDoctor(appointment: AppointmentReq): Promise<Appointment> {
        try {
            const [createAppointment] = await db('citas').insert(appointment).returning('*')
            return createAppointment
        } catch (error) {
            throw new Error(`Error creating doctor: ${JSON.stringify(appointment)}`)
        }
    }

    public async getAllappointments(): Promise<Appointment[]> {
        try {
            return db.select('*').from('citas')
        } catch (error) {
            throw new Error(`Error consulting appointments`)
        }
    }
}