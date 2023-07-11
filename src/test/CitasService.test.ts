import { DoctorRepository } from "../api/components/doctores/repository"
import { AppointmentService, AppointmentServiceImpl } from "../api/components/citas/service"
import { AppointmentRepository } from "../api/components/citas/repository"
import { Appointment, AppointmentReq } from "../api/components/citas/model"
import { AllAppointmentGetError, GetAllError } from "../utils/customErrors"
import { Doctor } from "../api/components/doctores/model"


describe('AppointmentService', () => {
    let appointmentService: AppointmentService
    let appointmentRepository: AppointmentRepository
    let doctorRepository: DoctorRepository


    beforeEach(() => {
        appointmentRepository = {
            getAllAppointment: jest.fn(),
            getAppointmentById: jest.fn(),
            updateAppointment: jest.fn(),
            createAppointment: jest.fn(),
            deleteAllAppointmentsByPatientNumberId: jest.fn(),
            deleteAppointmentById: jest.fn()
        }

        doctorRepository = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn(),
            getDoctorById: jest.fn(),
            updateDoctor: jest.fn(),
            deleteDoctor: jest.fn()
        }

        appointmentService = new AppointmentServiceImpl(appointmentRepository, doctorRepository)
    })

    describe('getAllAppointment', () => {
        it('should get all appointments from service', async () => {
            // Mock Process
            const appointments: Appointment[] = [
                {
                    identificacion_paciente: "1015786986",
                    especialidad: "Cardiología",
                    doctor: "Daniel Gómez",
                    consultorio: 106,
                    horario: "1:30 pm",
                    id_cita: 1,
                    id_doctor: 10,
                    created_at: "2023-07-06T02:59:54.741Z",
                    updated_at: "null"
                },
                {
                    identificacion_paciente: "1015786987",
                    especialidad: "Dermatología",
                    doctor: "Sergio Gómez",
                    consultorio: 107,
                    horario: "2:00 pm",
                    id_cita: 2,
                    id_doctor: 8,
                    created_at: "2023-07-05T03:52:54.741Z",
                    updated_at: "null"
                },
                {
                    identificacion_paciente: "1012459874",
                    especialidad: "Medicina general",
                    doctor: "Laura Gonzalez",
                    consultorio: 108,
                    horario: "7:30 am",
                    id_cita: 3,
                    id_doctor: 9,
                    created_at: "2023-07-01T12:31:52.211Z",
                    updated_at: "null"
                }
            ];

            (appointmentRepository.getAllAppointment as jest.Mock).mockResolvedValue(appointments)

            // Method execution
            const result = await appointmentService.getAllAppointments()

            // Asserts
            expect(appointmentRepository.getAllAppointment).toHaveBeenCalled()
            expect(result).toEqual(appointments)
        })
        it('should return an empty array when no appointments are found', async () => {
            // Mock Process
            (appointmentRepository.getAllAppointment as jest.Mock).mockResolvedValue([])

            // Method execution
            const result = await appointmentService.getAllAppointments()

            // Asserts
            expect(appointmentRepository.getAllAppointment).toHaveBeenCalled()
            expect(result).toEqual([])
        })
        it('should return an error when an error ocurrs', async () => {
            const error = new Error("Failed to get all appointments");
            // Mock Process
            (appointmentRepository.getAllAppointment as jest.Mock).mockImplementation(() => Promise.reject(error));

            // Asserts
            await expect(appointmentService.getAllAppointments()).rejects.toThrowError(new AllAppointmentGetError())
            expect(appointmentRepository.getAllAppointment).toHaveBeenCalled()
        })
    })

    describe('createAppointment', () => {
        it('should create a new appointment and return it from  service', async () => {
            // Mock Process
            const doctor: Doctor = { id_doctor: 10, nombre: 'Daniel', apellido: 'Gómez', especialidad: 'Cardiología', consultorio: 106 }

            const appointmentRes: Appointment = {
                identificacion_paciente: "1015786986",
                especialidad: "Cardiología",
                doctor: "Daniel Gómez",
                consultorio: 106,
                horario: "1:30 pm",
                id_cita: 1,
                id_doctor: 10,
                created_at: "2023-07-06T02:59:54.741Z",
                updated_at: "null"
            }

            const appointmentReq: AppointmentReq = {
                especialidad: "Cardiología",
                horario: "1:30 pm",
                id_doctor: 10,
                identificacion_paciente: "1015786986"
            };

            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            (appointmentRepository.createAppointment as jest.Mock).mockResolvedValue(appointmentRes)

            // Method execution
            const result = await appointmentService.createAppointment(appointmentReq)

            // Asserts
            expect(appointmentRepository.createAppointment).toHaveBeenCalledWith(appointmentReq)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(appointmentReq.id_doctor)
            expect(result).toEqual(appointmentRes)
        })
        it('should throw and error if doctor does not exist', async () => {
            // Mock Process
            const error = new Error("Failed to create appointment");
            const doctor = null;
            const appointmentReq: AppointmentReq = {
                especialidad: "Cardiología",
                horario: "1:30 pm",
                id_doctor: 10,
                identificacion_paciente: "1015786986"
            };
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctor);

            await expect(appointmentService.createAppointment(appointmentReq)).rejects.toThrowError(error)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(appointmentReq.id_doctor)
        })

        it('should throw an error if appointment repository fails insert appointment', async () => {
            // Mock Process
            const error = new Error("Failed to create appointment");
            const doctor: Doctor = { id_doctor: 10, nombre: 'Daniel', apellido: 'Gómez', especialidad: 'Cardiología', consultorio: 106 };
            const appointmentReq: AppointmentReq = {
                especialidad: "Cardiología",
                horario: "1:30 pm",
                id_doctor: 10,
                identificacion_paciente: "1015786986"
            };
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            (appointmentRepository.createAppointment as jest.Mock).mockRejectedValue(error);

            await expect(appointmentService.createAppointment(appointmentReq)).rejects.toThrowError(error)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(appointmentReq.id_doctor)
            expect(appointmentRepository.createAppointment).toHaveBeenCalledWith(appointmentReq)

        })
    })

    describe('getAppointmentById', () => {
        it('should get appointment by id from service', async () => {
            // Mock Process
            const doctor: Doctor = { id_doctor: 10, nombre: 'Daniel', apellido: 'Gómez', especialidad: 'Medicina General', consultorio: 106 }
            const appointmentRes: Appointment = {
                identificacion_paciente: "1015786986",
                especialidad: "Cardiología",
                doctor: "Daniel Gómez",
                consultorio: 106,
                horario: "1:30 pm",
                id_cita: 1,
                id_doctor: 10,
                created_at: "2023-07-06T02:59:54.741Z",
                updated_at: "null"
            }

            const appointmentId = 1;

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointmentRes);
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            // Method execution
            const result = await appointmentService.getAppointmentById(appointmentId)

            // Asserts
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(appointmentRes.id_doctor)
            expect(result).toEqual(appointmentRes)
        })
        it('should return an error when no doctor are found by appointmentRes.id_doctor', async () => {
            const error = new Error("Record has not found yet");

            const doctor = null;
            const appointmentRes: Appointment = {
                identificacion_paciente: "1015786986",
                especialidad: "Cardiología",
                doctor: "Daniel Gómez",
                consultorio: 106,
                horario: "1:30 pm",
                id_cita: 1,
                id_doctor: 10,
                created_at: "2023-07-06T02:59:54.741Z",
                updated_at: "null"
            }
            const appointmentReq: AppointmentReq = {
                especialidad: "Cardiología",
                horario: "1:30 pm",
                id_doctor: 10,
                identificacion_paciente: "1015786986"
            };
            const appointmentId = 1;

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointmentRes);
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctor);
            // Method execution
            await expect(appointmentService.getAppointmentById(appointmentId)).rejects.toThrowError(error)
            // Asserts
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(appointmentRes.id_doctor)
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(appointmentId)

        })
        it('should return an error when no appointments are found by id', async () => {
            const error = new Error("Record has not found yet");
            const appointmentRes = null
            const appointmentId = 1;

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointmentRes);
            // Method execution
            await expect(appointmentService.getAppointmentById(appointmentId)).rejects.toThrowError(error)
            // Asserts
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(appointmentId)

        })
    })
    describe('updateAppointment', () => {

        it('should update an appointment and return it from  service', async () => {
            // Mock Process
            const doctor: Doctor = { id_doctor: 10, nombre: 'Daniel', apellido: 'Gómez', especialidad: 'Cardiología', consultorio: 106 }

            const appointmentRes: Appointment = {
                identificacion_paciente: "1015786986",
                especialidad: "Cardiología",
                doctor: "Daniel Gómez",
                consultorio: 106,
                horario: "1:30 pm",
                id_cita: 1,
                id_doctor: 10,
                created_at: "2023-07-06T02:59:54.741Z",
                updated_at: "null"
            }
            const appointmentResUpdated: Appointment = {
                identificacion_paciente: "1015786986",
                especialidad: "Cardiología",
                doctor: "Daniel Gómez",
                consultorio: 106,
                horario: "4:30 pm",
                id_cita: 1,
                id_doctor: 10,
                created_at: "2023-07-06T02:59:54.741Z",
                updated_at: "null"
            }

            const updates: Partial<AppointmentReq> = {
                horario: "4:30 pm",
            }

            const appointmentId = 1;

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointmentRes);
            (appointmentRepository.updateAppointment as jest.Mock).mockResolvedValue(appointmentResUpdated);
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctor)

            // Method execution
            const result = await appointmentService.updateAppointment(appointmentId, updates)

            // Asserts
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(appointmentId)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(appointmentResUpdated.id_doctor)
            expect(appointmentRepository.updateAppointment).toHaveBeenCalledWith(appointmentId, appointmentResUpdated)
            expect(result).toEqual(appointmentResUpdated)
        })
        it('should throw and error if appointment does not exist', async () => {
            // Mock Process
            const error = new Error("Failed to update appointment");
            const appointment = null;
            const updates: Partial<AppointmentReq> = {
                horario: "4:30 pm",
            }
            const appointmentId = 1;

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointment);

            await expect(appointmentService.updateAppointment(appointmentId, updates)).rejects.toThrowError(error)
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(appointmentId)
        })

        it('should throw an error if doctor does not exist', async () => {
            // Mock Process
            const error = new Error("Failed to update appointment");
            const doctor = null;
            const appointmentRes: Appointment = {
                identificacion_paciente: "1015786986",
                especialidad: "Cardiología",
                doctor: "Daniel Gómez",
                consultorio: 106,
                horario: "1:30 pm",
                id_cita: 1,
                id_doctor: 10,
                created_at: "2023-07-06T02:59:54.741Z",
                updated_at: "null"
            }

            const updates: Partial<AppointmentReq> = {
                horario: "4:30 pm",
            }
            const appointmentReq: AppointmentReq = {
                especialidad: "Cardiología",
                horario: "1:30 pm",
                id_doctor: 10,
                identificacion_paciente: "1015786986"
            };
            const appointmentId = 1;

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointmentRes);
            (doctorRepository.getDoctorById as jest.Mock).mockRejectedValue(doctor);

            await expect(appointmentService.updateAppointment(appointmentId, updates)).rejects.toThrowError(error)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(appointmentRes.id_doctor)

        })
    })
    describe('deleteAppointment', () => {
        it('should delete appointment by id', async () => {
            // Mock Process
            const appointment: Appointment =
            {
                identificacion_paciente: "1015786986",
                especialidad: "Cardiología",
                doctor: "Daniel Gómez",
                consultorio: 106,
                horario: "1:30 pm",
                id_cita: 1,
                id_doctor: 10,
                created_at: "2023-07-06T02:59:54.741Z",
                updated_at: "null"
            };

            const appointmentId = 1;

            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointment);
            (appointmentRepository.deleteAppointmentById as jest.Mock)

            // Method execution
            await appointmentService.deleteAppoinmentById(appointmentId)

            // Asserts
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(appointmentId)
            expect(appointmentRepository.deleteAppointmentById).toHaveBeenCalledWith(appointmentId)
        })
        it('should throw an error cause appointment was not found', async () => {
            const error = new Error("Failed to delete appointment");
            // Mock Process
            const appointment = undefined;
            const appointmentId = 1;
            (appointmentRepository.getAppointmentById as jest.Mock).mockResolvedValue(appointment);
            // Method execution
            await expect(appointmentService.deleteAppoinmentById(appointmentId)).rejects.toThrowError(error)
            // Asserts
            expect(appointmentRepository.getAppointmentById).toHaveBeenCalledWith(appointmentId)
        })
    })
})