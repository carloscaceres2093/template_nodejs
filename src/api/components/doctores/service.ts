import { Doctor } from "./model";

export interface DoctorService {
    getAllDoctors(): Doctor[],
    createDoctor(): Doctor
}

export class DoctorServiceImpl implements DoctorService {

    getAllDoctors(): Doctor[] {
        throw new Error("Method not implemented.");
    }
    createDoctor(): Doctor {
        throw new Error("Method not implemented.");
    }

}