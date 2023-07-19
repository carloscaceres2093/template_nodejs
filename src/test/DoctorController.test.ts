import { Request, Response } from "express"
import { DoctorController, DoctorControllerImpl } from "../api/components/doctores/controller"
import { DoctorService } from "../api/components/doctores/service"
import { Doctor, DoctorReq } from "../api/components/doctores/model"

const mockReq = {} as Request
const mockRes = {} as Response

describe('DoctorController', () => {
    let doctorSerivce: DoctorService
    let doctorController: DoctorController

    beforeEach(() => {
        doctorSerivce = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn(),
            getDoctorById: jest.fn(),
            updateDoctor: jest.fn(),
            deleteDoctor: jest.fn()
        }

        doctorController = new DoctorControllerImpl(doctorSerivce)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
    })

    describe('getAllDoctors', () => {
        it('should get all doctors', async () => {
            // Mock Process
            const doctors: Doctor[] = [
                { id_doctor: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio: 100 },
                { id_doctor: 2, nombre: 'Alveiro', apellido: 'Tarsisio', especialidad: 'Ortopedia', consultorio: 101 },
            ];

            (doctorSerivce.getAllDoctors as jest.Mock).mockResolvedValue(doctors)

            // Method execution
            await doctorController.getAllDoctors(mockReq, mockRes)

            // Asserts
            expect(doctorSerivce.getAllDoctors).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(doctors)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Internal Server Error');
            (doctorSerivce.getAllDoctors as jest.Mock).mockRejectedValue(error)

            await doctorController.getAllDoctors(mockReq, mockRes)

            expect(doctorSerivce.getAllDoctors).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Error getting all doctors" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('createDoctor', () => {
        it('should create a new doctor and return info', async () => {
            // Mock Process
            const doctorRes: Doctor = { id_doctor: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio: 100 }
            const doctorReq: DoctorReq = {
                nombre: 'Carlos',
                apellido: 'Caceres',
                especialidad: 'Medicina General',
                consultorio: 100
            };
            (mockReq.body as DoctorReq) = doctorReq;
            (doctorSerivce.createDoctor as jest.Mock).mockResolvedValue(doctorRes)

            // Method execution
            await doctorController.createDoctor(mockReq, mockRes)

            // Asserts
            expect(doctorSerivce.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Internal Server Error');
            (mockReq.body) = {};
            (doctorSerivce.createDoctor as jest.Mock).mockRejectedValue(error)

            await doctorController.createDoctor(mockReq, mockRes)

            //expect(doctorSerivce.createDoctor).toHaveBeenCalledWith({})
            expect(mockRes.json).toHaveBeenCalledWith({ message: '"nombre" is required' })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('getDoctorById', () => {
        it('should get doctor by id', async () => {
            // Mock Process
            const doctorRes: Doctor = { id_doctor: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio: 100 };
            (mockReq.params) = { id: "1" };
            (doctorSerivce.getDoctorById as jest.Mock).mockResolvedValue(doctorRes)

            // Method execution
            await doctorController.getDoctorById(mockReq, mockRes)

            // Asserts
            expect(doctorSerivce.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 if doctor not found', async () => {
            (mockReq.params) = { id: "1" };
            (doctorSerivce.getDoctorById as jest.Mock).mockResolvedValue(null)

            await doctorController.getDoctorById(mockReq, mockRes)

            expect(doctorSerivce.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Record has not found yet" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('should return 400 if an error occurs', async () => {
            const error = new Error('Internal Server Error');
            (mockReq.params) = { id: "1" };
            (doctorSerivce.getDoctorById as jest.Mock).mockRejectedValue(error)

            await doctorController.getDoctorById(mockReq, mockRes)

            expect(doctorSerivce.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to retrieve doctor" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })
})