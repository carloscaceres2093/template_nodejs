import { DoctorCreationError, DoctorDeleteError, DoctorUpdateError, RecordNotFoundError, GetAllError } from "../../../config/customErrors"
import logger from "../../../utils/logger"
import { AppointmentReq, Appointment, AppointmentResDB } from "./model"
import { AppointmentRepository } from "./repository"
import { DoctorRepository } from "../doctores/repository"
import { Doctor } from "../doctores/model"

export interface AppointmentService {
    getAllAppointments(): Promise<Appointment[]>
    createAppointment(patientReq: AppointmentReq): Promise<Appointment>
    getAppointmentById(id: number): Promise<Appointment>
}


export class AppointmentServiceImpl implements AppointmentService {
    private appointmentRepository: AppointmentRepository
    private doctorRepository: DoctorRepository

    constructor(appointmentRepository: AppointmentRepository, doctorRepository: DoctorRepository){
        this.appointmentRepository = appointmentRepository
        this.doctorRepository = doctorRepository
    }

    public async getAllAppointments(): Promise<Appointment[]> {
        try{
            
            const patients = await  this.appointmentRepository.getAllAppointment()
            console.log("LLEgamos")
            console.log(patients)
            return patients
        } catch (error){
            logger.error(error)
            throw new GetAllError("Failed getting all appointments from service", "appointment")
        }
    }
    
    public  async createAppointment(appointmentReq: AppointmentReq): Promise<Appointment> {
        try{
            const appointmentDb = await this.appointmentRepository.createAppointment(appointmentReq) 
            const doctor = await this.doctorRepository.getDoctorById(appointmentDb.id_doctor)
            const appointment: Appointment = mapAppointment(appointmentDb, doctor)
            return appointment
        } catch (error){
            throw new DoctorCreationError("Failed to create appointment from service")
        }
    }

    public async getAppointmentById(id: number): Promise<Appointment> {
        try {
            const appointmentDb =  await this.appointmentRepository.getAppointmentById(id)
            const doctor = await this.doctorRepository.getDoctorById(appointmentDb.id_doctor)
            const appointment: Appointment = mapAppointment(appointmentDb, doctor)
            return appointment
        } catch (error) {
            logger.error('Failed to get appointment from service')
            throw new RecordNotFoundError()
        }
    }

   
}


function mapAppointment(appointmentDb: AppointmentResDB, doctor: Doctor): Appointment {
    const appointment: Appointment = {
        identificacion_paciente: appointmentDb.identificacion_paciente, 
        especialidad:appointmentDb.especialidad,
        doctor: `${doctor.nombre} ${doctor.apellido}`,
        consultorio: doctor.consultorio,
        horario: appointmentDb.horario
    }
    return appointment
}