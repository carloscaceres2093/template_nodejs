import { Doctor, DoctorReq } from "./model";
import { DoctorRepository } from "./repository";

export interface DoctorService {
    getAllDoctors(): Promise<Doctor[]>,
    createDoctor(doctorReq: DoctorReq): Promise<Doctor>
}

export class DoctorServiceImpl implements DoctorService {
    private doctorRepository: DoctorRepository

    constructor() {
        this.doctorRepository = new DoctorRepository
    }
    getAllDoctors(): Promise<Doctor[]> {
        const doctores: Promise<Doctor[]> = this.doctorRepository.getAllDoctors()
        return doctores
    }
    createDoctor(doctorReq: DoctorReq): Promise<Doctor> {
        return this.doctorRepository.createDoctor(doctorReq)
    }

}