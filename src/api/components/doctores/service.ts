import { Doctor, DoctorReq } from "./model";
import { DoctorRepository } from "./repository";

export interface DoctorService {
    getAllDoctors(): Doctor[],
    createDoctor(doctorReq: DoctorReq): Promise<Doctor>
}

export class DoctorServiceImpl implements DoctorService {
    private doctorRepository: DoctorRepository

    constructor() {
        this.doctorRepository = new DoctorRepository
    }
    getAllDoctors(): Doctor[] {
        const doctores = [
            { id_doctor: 1, nombre: 'John', apellido: 'Doe', especialidad: 'Pediatría', consultorio: 101, correo: 'john.doe@123.4', createdAt: new Date() },
            { id_doctor: 1, nombre: 'Jose', apellido: 'Rodrigez', especialidad: 'Medicina General', consultorio: 102, createdAt: new Date() },
        ]
        return doctores
    }
    createDoctor(doctorReq: DoctorReq): Promise<Doctor> {
        const createdDoctor: Promise<Doctor> = this.doctorRepository.createDoctor(doctorReq)
        return createdDoctor
    }

}