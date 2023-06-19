import { Doctor, DoctorReq } from "./model";

export interface DoctorService {
    getAllDoctors(): Doctor[];
    createDoctor(doctorReq: DoctorReq): Doctor;
}

export class DoctorServiceImpl implements DoctorService {

    public getAllDoctors(): Doctor[] {
        const doctores: Doctor[] = [
            {id_doctor: 1, nombre: 'John', apellido: 'Doe', especialidad: 'Pediatría', consultorio: 101, correo: 'john.doe@123.4', createdAt: new Date()},
            {id_doctor: 2, nombre: 'Jose', apellido: 'Rodrigez', especialidad: 'Medicina General', consultorio: 102, createdAt: new Date()},
        ];
        return doctores;
    }

    public createDoctor(doctorReq: DoctorReq): Doctor {
        const requiredFields: string[] = ['id_doctor', 'nombre', 'apellido', 'especialidad', 'consultorio', 'createdAt'];

        // Verificar si faltan campos requeridos
        const missingFields: string[] = requiredFields.filter(field => !(field in doctorReq));
        if (missingFields.length > 0) {
            throw new Error(`Faltan los siguientes campos en la solicitud: ${missingFields.join(', ')}`);
        }

        // Verificar si hay campos adicionales en la solicitud
        const extraFields: string[] = Object.keys(doctorReq).filter(field => !requiredFields.includes(field));
        if (extraFields.length > 0) {
            throw new Error(`Campos adicionales en la solicitud: ${extraFields.join(', ')}`);
        }

        // Crear el objeto Doctor utilizando los campos de la solicitud
        const doctor: Doctor = {
            id_doctor: doctorReq.id_doctor,
            nombre: doctorReq.nombre,
            apellido: doctorReq.apellido,
            especialidad: doctorReq.especialidad,
            consultorio: doctorReq.consultorio,
            createdAt: doctorReq.createdAt,
        };

        return doctor;
    }
}



