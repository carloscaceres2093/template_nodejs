import { DoctorCreationError, RecordNotFoundError } from "../../../config/customErrors"
import logger from "../../../utils/logger"
import { Doctor, DoctorReq } from "./model"
import { DoctorRepository } from "./repository"


export interface DoctorService {
    getAllDoctors(): Promise<Doctor[]>
    createDoctor(doctorReq: DoctorReq): Promise<Doctor>
    getDoctorById(id: number): Promise<Doctor>
}

export class DoctorServiceImpl implements DoctorService {
    private doctorRepository: DoctorRepository

    constructor(doctorRepository: DoctorRepository){
        this.doctorRepository = doctorRepository
    }

    public getAllDoctors(): Promise<Doctor[]> {
        const doctors: Promise<Doctor[]> =  this.doctorRepository.getAllDoctors()
        return doctors
    }
    
    public   createDoctor(doctorReq: DoctorReq): Promise<Doctor> {
        try{
            return this.doctorRepository.createDoctor(doctorReq)
        } catch (error){
            throw new DoctorCreationError("Failed to create doctor from service")
        }
    }

    public getDoctorById(id: number): Promise<Doctor> {
        try {
            return this.doctorRepository.getDoctorById(id)
        } catch (error) {
            logger.error('Failed to get doctor from service')
            throw new RecordNotFoundError()
        }
    }
}