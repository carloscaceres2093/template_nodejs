import { Doctor } from "./model";

export interface DoctorService {
    getAllDoctors(): Doctor[],
    createDoctor(): Doctor
}

export class DoctorServiceImpl implements DoctorService {

    getAllDoctors(): Doctor[] {
        const doctores = [
            { id_doctor: 1, nombre: 'John', apellido: 'Doe', especialidad: 'Pediatría', consultorio: 101, correo: 'john.doe@123.4', createdAt: new Date() },
            { id_doctor: 1, nombre: 'Jose', apellido: 'Rodrigez', especialidad: 'Medicina General', consultorio: 102, createdAt: new Date() },
        ]
        return doctores
    }
    createDoctor(): Doctor {
        return { id_doctor: 1, nombre: 'Jose', apellido: 'Rodrigez', especialidad: 'Medicina General', consultorio: 102, createdAt: new Date() }
    }

}