import { db } from "../../../config/database"
import { Doctor, DoctorReq } from "./model"
import logger from '../../../utils/logger'
import { DoctorCreationError, DoctorGetAllError, RecordNotFoundError } from "../../../config/customErrors"

export class DoctorRepository {
    public async createDoctor(doctor: DoctorReq): Promise<Doctor> {
        try {
            const [createdDoctor] =  await db('doctores').insert(doctor).returning('*') // select * from doctores where id_doctor=?
            return createdDoctor
        } catch (error) {
            throw new DoctorCreationError(`Failed to create doctor dubt: ${error}`)
        }
    }

    public async getAllDoctors(): Promise<Doctor[]> {
        try {
            return  db.select('*').from('doctores')
        } catch (error) {
            throw new DoctorGetAllError()
        }
    }

    public async getDoctorById(id: number): Promise<Doctor> {
        try{
            logger.info(id)
            const doctor = await db('doctores').where({ id_doctor: id }).first()
            return doctor
        } catch (error){
            logger.error( 'Failed get doctor by id in repository', {error})
            throw new RecordNotFoundError()
        }
    }
}