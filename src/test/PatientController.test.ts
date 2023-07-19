import { Request, Response } from "express"
import { PatientController, PatientControllerImpl } from "../api/components/pacientes/controller"
import { PatientService } from "../api/components/pacientes/service"
import { Patient, PatientReq } from "../api/components/pacientes/model"

const mockReq = {} as Request
const mockRes = {} as Response

describe('PatientController', () => {
    let patientSerivce: PatientService
    let patientController: PatientController

    beforeEach(() => {
        patientSerivce = {
            getAllPatients: jest.fn(),
            createPatient: jest.fn(),
            getPatientById: jest.fn(),
            updatePatient: jest.fn(),
            deletePatient: jest.fn()
        }

        patientController = new PatientControllerImpl(patientSerivce)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
    })

    describe('getAllPatient', () => {
        it('should get all patients', async () => {
            // Mock Process
            const patients: Patient[] = [
                { id_paciente: 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: '1234567896', telefono: 123456789, createdAt: new Date ("05-05-2020"), updatedAt: new Date ("20-20-2023") },
                { id_paciente: 2, nombre: 'Alveiro', apellido: 'Tarsisio', identificacion: '3108945632', telefono: 987654321, createdAt: new Date ("05-05-2020"), updatedAt: new Date ("20-20-2023")},
            ];

            (patientSerivce.getAllPatients as jest.Mock).mockResolvedValue(patients)

            // Method execution
            await patientController.getAllPatient(mockReq, mockRes)

            // Asserts
            expect(patientSerivce.getAllPatients).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(patients)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Internal Server Error');
            (patientSerivce.getAllPatients as jest.Mock).mockRejectedValue(error)

            await patientController.getAllPatient(mockReq, mockRes)

            expect(patientSerivce.getAllPatients).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Error getting all patients" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('createPatient', () => {
        it('should create a new patient and return info', async () => {
            // Mock Process
            const patientRes: Patient = { id_paciente: 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: '1234567896', telefono: 123456789, createdAt: new Date ("05-05-2020"), updatedAt: new Date ("20-20-2023") }
            const patientReq: PatientReq = {
                nombre: 'Carlos',
                apellido: 'Caceres',
                identificacion: '1234567896',
                telefono: 123456789
            };
            (mockReq.body as PatientReq) = patientReq;
            (patientSerivce.createPatient as jest.Mock).mockResolvedValue(patientRes)

            // Method execution
            await patientController.createPatient(mockReq, mockRes)

            // Asserts
            expect(patientSerivce.createPatient).toHaveBeenCalledWith(patientReq)
            expect(mockRes.json).toHaveBeenCalledWith(patientRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Internal Server Error');
            (mockReq.body) = {};
            (patientSerivce.createPatient as jest.Mock).mockRejectedValue(error)

            await patientController.createPatient(mockReq, mockRes)

            expect(patientSerivce.createPatient).toHaveBeenCalledWith({})
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal Server Error" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('getPatientById', () => {
        it('should get patient by id', async () => {
            // Mock Process
            const patientRes: Patient = { id_paciente: 1, nombre: 'Carlos', apellido: 'Caceres', identificacion: '1234567896', telefono: 123456789, createdAt: new Date ("05-05-2020"), updatedAt: new Date ("20-20-2023") };
            (mockReq.params) = { id: "1" };
            (patientSerivce.getPatientById as jest.Mock).mockResolvedValue(patientRes)

            // Method execution
            await patientController.getPatientById(mockReq, mockRes)

            // Asserts
            expect(patientSerivce.getPatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(patientRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 if patient not found', async () => {
            (mockReq.params) = { id: "1" };
            (patientSerivce.getPatientById as jest.Mock).mockResolvedValue(null)

            await patientController.getPatientById(mockReq, mockRes)

            expect(patientSerivce.getPatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Record has not found yet" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('should return 400 if an error occurs', async () => {
            const error = new Error('Internal Server Error');
            (mockReq.params) = { id: "1" };
            (patientSerivce.getPatientById as jest.Mock).mockRejectedValue(error)

            await patientController.getPatientById(mockReq, mockRes)

            expect(patientSerivce.getPatientById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to retrieve patient" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })
})