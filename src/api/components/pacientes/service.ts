import { PatientCreateError, PatientDeleteError, PatientUpdateError, RecordNotFoundError } from "../../../utils/customErrors"
import logger from "../../../utils/logger"
import { AppointmentRepository } from "../citas/repository"
import { PatientReq, Patient } from "./model"
import { PatientRepository } from "./repository"

export interface PatientService {
    getAllPatients(): Promise<Patient[]>
    createPatient(patientReq: PatientReq): Promise<Patient>
    getPatientById(id: number): Promise<Patient>
    updatePatient(id: number, updates: Partial<PatientReq>): Promise<Patient>,
    deletePatient(id: number): Promise<void>
}

export class PatientServiceImpl implements PatientService {
    private patientRepository: PatientRepository
    private appointmentRepository: AppointmentRepository

    constructor(patientRepository: PatientRepository, appointmentRepository: AppointmentRepository) {
        this.patientRepository = patientRepository
        this.appointmentRepository = appointmentRepository
    }

    public async updatePatient(id: number, updates: Partial<PatientReq>): Promise<Patient> {
        try {
            const existPatient = await this.patientRepository.getPatientById(id)
            const appointmentList = await this.appointmentRepository.getAllAppointment()
            const existAppointment = appointmentList.find(appointment => appointment.identificacion_paciente == existPatient.identificacion);
            if (!existPatient && existAppointment) {
                logger.error('Failed to update patient from service')
                throw new RecordNotFoundError()
            }
            const updatePatient = { ...existPatient, ...updates }
            await this.patientRepository.updatePatient(id, updatePatient)
            return updatePatient
        } catch (error) {
            logger.error('Failed to update patient from service')
            throw new PatientUpdateError()
        }
    }

    public getAllPatients(): Promise<Patient[]> {
        const patients: Promise<Patient[]> = this.patientRepository.getAllPatients()
        return patients
    }

    public createPatient(patientReq: PatientReq): Promise<Patient> {
        try {
            return this.patientRepository.createPatient(patientReq)
        } catch (error) {
            logger.error('Failed to create patient from service')
            throw new PatientCreateError()
        }
    }

    public getPatientById(id: number): Promise<Patient> {
        try {
            return this.patientRepository.getPatientById(id)
        } catch (error) {
            logger.error('Failed to get patient from service')
            throw new RecordNotFoundError()
        }
    }

    public async deletePatient(id: number): Promise<void> {
        try {
            const patientDB = await this.patientRepository.getPatientById(id)
            if (!patientDB) {
                throw new RecordNotFoundError()
            }
            const numId = patientDB.identificacion
            await this.appointmentRepository.deleteAllAppointmentsByPatientNumberId(numId)
            await this.patientRepository.deletePatient(id)
        } catch (error) {
            logger.error('Failed to delete patient')
            throw new PatientDeleteError()
        }
    }
}