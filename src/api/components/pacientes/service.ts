import { Patient, PatientReq } from "./model"
import { PatientRepository } from "./repository"

export interface PatientService {
    getPatient(identificacion: string): Promise<Patient>
    createPatient(patientReq: PatientReq): Promise<Patient>
}

export class PatientServiceImpl implements PatientService {

    private patientRepository: PatientRepository

    constructor() {
        this.patientRepository = new PatientRepository
    }
    async getPatient(identificacion: string): Promise<Patient> {
        return this.patientRepository.getPatient(identificacion)
    }
    async createPatient(patientReq: PatientReq): Promise<Patient> {
        return this.patientRepository.createPatient(patientReq)
    }

}