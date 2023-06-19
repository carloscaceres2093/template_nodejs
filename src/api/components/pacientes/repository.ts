import { db } from '../../../config/database'
import { Patient, PatientReq } from './model'

export class PatientRepository {
    public async createPatient(patient: PatientReq): Promise<Patient> {
        try {
            const [createPatient] = await db('pacientes').insert(patient).returning('*')
            return createPatient
        } catch (error) {
            throw new Error(`Error creating patient: ${JSON.stringify(patient)}`)
        }
    }

    public async getPatient(identificacion_paciente: string): Promise<Patient> {
        try {
            return db.select('*').where('identificacion', identificacion_paciente).from('pacientes')
        } catch (error) {
            throw new Error(`Error consulting patient with id ${identificacion_paciente}`)
        }
    }
}