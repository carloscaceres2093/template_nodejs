import { db } from "../../../config/database"
import { Doctor, DoctorReq } from "./model"
import logger from '../../../utils/logger'
import { AppoinmentCreateError, DoctorCreationError, DoctorDeleteError, DoctorGetAllError, DoctorUpdateError, RecordNotFoundError } from "../../../utils/customErrors"

export class DoctorRepository {
    public async createDoctor(doctor: DoctorReq): Promise<Doctor> {
        try {
            doctor.created_at = new Date().toISOString()
            const [createdDoctor] = await db('doctores').insert(doctor).returning('*') // select * from doctores where id_doctor=?
            return createdDoctor
        } catch (error) {
            logger.error('Failed create doctor in repository', { error })
            throw new DoctorCreationError('Failed create doctor in repository')
        }
    }

    public async getAllDoctors(): Promise<Doctor[]> {
        try {
            return db.select('*').from('doctores')
        } catch (error) {
            throw new DoctorGetAllError()
        }
    }

    public async getDoctorById(id: number): Promise<Doctor> {
        try {
            const doctor = await db('doctores').where({ id_doctor: id }).first()
            return doctor
        } catch (error) {
            logger.error('Failed get doctor by id in repository', { error })
            throw new RecordNotFoundError()
        }
    }

    public async updateDoctor(id: number, updates: Partial<DoctorReq>): Promise<void> {
        try {
            updates.updated_at = new Date().toISOString()
            await db('doctores').where({ id_doctor: id }).update(updates)
        } catch (error) {
            logger.error('Failed updated doctor in repository', { error })
            throw new DoctorUpdateError()
        }
    }

    public async deleteDoctor(id: number): Promise<void> {
        try {
            await db('doctores').where({ id_doctor: id }).del()
        } catch (error) {
            logger.error('Failed deleting doctor in repository', { error })
            throw new DoctorDeleteError()
        }
    }
}

export default {
    DoctorRepository
}