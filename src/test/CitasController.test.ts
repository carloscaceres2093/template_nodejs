import { Request, Response } from "express"
import { AppointmentController, AppointmentControllerImpl } from "../api/components/citas/controller"
import { AppointmentService } from "../api/components/citas/service"
import { Appointment } from "../api/components/citas/model"

const mockReq = {} as Request
const mockRes = {} as Response

describe('Citas Controller', () => {
    let appointmentService: AppointmentService
    let appointmentController: AppointmentController

    beforeEach(() => {
        appointmentService = {
            getAllAppointments: jest.fn(),
            createAppointment: jest.fn(),
            getAppointmentById: jest.fn(),
            updateAppointment: jest.fn(),
            deleteAppoinmentById: jest.fn()
        }
        appointmentController = new AppointmentControllerImpl(appointmentService)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
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
})

