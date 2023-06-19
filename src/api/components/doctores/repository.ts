import { db } from '../../../config/database'
import { Doctor, DoctorReq } from './model'

export class DoctorRepository {
    public async createDoctor(doctor: DoctorReq): Promise<Doctor> {
        try {
            const [createDoctor] = await db('doctores').insert(doctor).returning('*')
            return createDoctor
        } catch (error) {
            throw new Error(`Error creating doctor: ${doctor}`)
        }
    }

    public async getAllDoctors(): Promise<Doctor[]> {
        try {
            return db.select('*').from('doctores')
        } catch (error) {
            throw new Error(`Error consulting doctor`)
        }
    }
}