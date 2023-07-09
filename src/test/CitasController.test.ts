import { Request, Response } from "express"
import { AppointmentController, AppointmentControllerImpl } from "../api/components/citas/controller"
import { AppointmentService } from "../api/components/citas/service"
import { Appointment, AppointmentReq } from "../api/components/citas/model"
import Joi from "joi"
import { createAppointmentSchema, updateAppointmentSchema } from "../api/components/citas/validations/citas.validations"
import { AppointmentDeleteError, AppointmentUpdateError } from "../utils/customErrors"

const mockReq = {} as Request
const mockRes = {} as Response
let validationResult = {} as Joi.ValidationResult

describe('Citas Controller', () => {
    let appointmentService: AppointmentService
    let appointmentController: AppointmentController
    let validationError: Joi.ValidationError
    let validationErrorItem: Joi.ValidationErrorItem[]

    beforeEach(() => {
        appointmentService = {
            getAllAppointments: jest.fn(),
            createAppointment: jest.fn(),
            getAppointmentById: jest.fn(),
            updateAppointment: jest.fn(),
            deleteAppoinmentById: jest.fn()
        }

        validationErrorItem = [{
            message: "Validation Schema Error",
            path: [],
            type: "string"
        }]

        validationError = {
            name: 'ValidationError',
            isJoi: true,
            details: validationErrorItem,
            annotate: (stripColors?: boolean | undefined) => "Error",
            _original: null,
            message: "Validation Schema Error"
        }
        appointmentController = new AppointmentControllerImpl(appointmentService)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
        validationResult.value = jest.fn().mockReturnThis()
        validationResult.error = validationError
    })

    describe('getAllAppointments', () => {
        it('should get all appointments', async () => {
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

            (appointmentService.getAllAppointments as jest.Mock).mockResolvedValue(appointments)

            // Method execution
            await appointmentController.getAllAppointment(mockReq, mockRes)

            // Asserts
            expect(appointmentService.getAllAppointments).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(appointments)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Internal Server Error');
            (appointmentService.getAllAppointments as jest.Mock).mockRejectedValue(error)

            await appointmentController.getAllAppointment(mockReq, mockRes)

            expect(appointmentService.getAllAppointments).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Error getting all appointments" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('updateAppointment', () => {
        it('should update appointment by id', async () => {
            // Mock Process
            (mockReq.params) = { id: "1" };

            const appointmentReq: AppointmentReq =
            {
                especialidad: "Cardiología",
                horario: "1:30 pm",
                id_doctor: 10,
                identificacion_paciente: "1015786986"
            };
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
            (mockReq.body as AppointmentReq) = appointmentReq;
            const mockValidation = (validationResult.value as jest.Mock);
            mockValidation.mockReturnValue(appointmentReq);
            jest.spyOn(updateAppointmentSchema, 'validate').mockReturnValue(mockValidation());
            (appointmentService.updateAppointment as jest.Mock).mockReturnValue(appointment)

            // Method execution
            await appointmentController.updateAppointment(mockReq, mockRes)

            // Asserts
            expect(appointmentService.updateAppointment).toHaveBeenCalledTimes(1)
            expect(updateAppointmentSchema.validate).toHaveBeenCalledWith(appointmentReq)
            expect(mockRes.json).toHaveBeenCalledWith(appointment)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('should be handler service error and return 400 status', async () => {
            const error = new AppointmentUpdateError();
            mockReq.body = {};
            (mockReq.params) = { id: "1" };
            const mockValidation = (validationResult.value as jest.Mock);
            mockValidation.mockReturnValue(mockReq.body);
            jest.spyOn(updateAppointmentSchema, 'validate').mockReturnValue(mockValidation());
            (appointmentService.updateAppointment as jest.Mock).mockRejectedValueOnce(error)

            await appointmentController.updateAppointment(mockReq, mockRes)

            expect(appointmentService.updateAppointment).toHaveBeenCalledTimes(1)
            expect(updateAppointmentSchema.validate).toHaveBeenCalledWith(mockReq.body)
            expect(mockRes.json).toHaveBeenCalledWith({
                error_name: "AppointmentUpdateError",
                message: "Failed Updating appointment"
            })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('should be handler schema error and return 400 status', async () => {
            (mockReq.body) = {};
            const mockValidation = (validationResult.value as jest.Mock);
            mockValidation.mockReturnValue(validationError);
            jest.spyOn(updateAppointmentSchema, 'validate').mockReturnValueOnce(validationResult);

            await appointmentController.updateAppointment(mockReq, mockRes)

            expect(updateAppointmentSchema.validate).toHaveBeenCalledWith({})
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Validation Schema Error"
            })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('createAppointment', () => {
        it('should create a new appointment and return info', async () => {
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
            const appointmentReq: AppointmentReq =
            {
                especialidad: "Cardiología",
                horario: "1:30 pm",
                id_doctor: 10,
                identificacion_paciente: "1015786986"
            };
            (mockReq.body as AppointmentReq) = appointmentReq;
            const mockValidation = (validationResult.value as jest.Mock);
            mockValidation.mockReturnValue(appointmentReq);
            jest.spyOn(createAppointmentSchema, 'validate').mockReturnValue(mockValidation());
            (appointmentService.createAppointment as jest.Mock).mockResolvedValue(appointment);
            // Method execution

            await appointmentController.createAppointment(mockReq, mockRes)
            // Asserts
            expect(createAppointmentSchema.validate).toHaveBeenCalledWith(appointmentReq)
            expect(mockRes.json).toHaveBeenCalledWith(appointment)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('should be handler schema error and return 400 status', async () => {
            (mockReq.body) = {};
            const mockValidation = (validationResult.value as jest.Mock);
            mockValidation.mockReturnValue(validationError);
            jest.spyOn(createAppointmentSchema, 'validate').mockReturnValueOnce(validationResult);

            await appointmentController.createAppointment(mockReq, mockRes)

            expect(createAppointmentSchema.validate).toHaveBeenCalledWith({})
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Validation Schema Error"
            })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('should be handler service unknown error and return 400 status', async () => {
            const error = new Error('Internal Server Error');
            // Mock Process
            mockReq.body = {};
            const mockValidation = (validationResult.value as jest.Mock);
            mockValidation.mockReturnValue(mockReq.body);
            jest.spyOn(createAppointmentSchema, 'validate').mockReturnValue(mockValidation());
            (appointmentService.createAppointment as jest.Mock).mockRejectedValue(error);
            // Method execution

            await appointmentController.createAppointment(mockReq, mockRes)
            // Asserts
            expect(createAppointmentSchema.validate).toHaveBeenCalledWith(mockReq.body)
            expect(appointmentService.createAppointment).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal Server Error" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('getAppointmentById', () => {
        it('should get appointment by id', async () => {
            // Mock Process
            const appointment: Appointment = {
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
            (mockReq.params) = { id: "1" };
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(appointment)

            // Method execution
            await appointmentController.getAppointmentById(mockReq, mockRes)

            // Asserts
            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(appointment)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 if an appointment not found', async () => {
            (mockReq.params) = { id: "1" };
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(null)

            await appointmentController.getAppointmentById(mockReq, mockRes)

            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Record has not found yet" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('should return 400 if an error occurs', async () => {
            const error = new Error('Internal Server Error');
            (mockReq.params) = { id: "1" };
            (appointmentService.getAppointmentById as jest.Mock).mockRejectedValue(error)

            await appointmentController.getAppointmentById(mockReq, mockRes)

            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to retrieve appointment" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('should return error if id is NaN', async () => {
            (appointmentService.getAppointmentById as jest.Mock).mockRejectedValue(NaN)

            await appointmentController.getAppointmentById(mockReq, mockRes)

            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to retrieve appointment" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('deleteAppointment', () => {
        it('should delete appointment by id', async () => {
            // Mock Process
            const message = {
                message: `Appointment was deleted successfully`
            };
            (mockReq.params) = { id: "1" };

            appointmentService.deleteAppoinmentById as jest.Mock

            // Method execution
            await appointmentController.deleteAppointment(mockReq, mockRes)

            // Asserts
            expect(appointmentService.deleteAppoinmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(message)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 if an error occurs', async () => {
            const error = new Error('Internal Server Error');
            (mockReq.params) = { id: "1" };
            (appointmentService.deleteAppoinmentById as jest.Mock).mockRejectedValue(error)

            await appointmentController.deleteAppointment(mockReq, mockRes)

            expect(appointmentService.deleteAppoinmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to delete appointment" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('should return 400 if an AppointmentDeleteError occurs', async () => {
            const error = new AppointmentDeleteError();
            (mockReq.params) = { id: "1" };
            (appointmentService.deleteAppoinmentById as jest.Mock).mockRejectedValue(error)

            await appointmentController.deleteAppointment(mockReq, mockRes)

            expect(appointmentService.deleteAppoinmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({
                error_name: "AppointmentDeleteError",
                message: "Failed to delete appointment"
            })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })
})

