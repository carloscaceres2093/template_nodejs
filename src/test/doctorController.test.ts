import { Request, Response } from "express"
import { DoctorController, DoctorControllerImpl } from "../api/components/doctores/controller"
import { DoctorService } from "../api/components/doctores/service"
import { Doctor, DoctorReq } from "../api/components/doctores/model"
import Joi from "joi"
import { createDoctorSchema } from "../api/components/doctores/validations/doctor.validations"
import { DoctorCreationError } from "../utils/customErrors"

const mockReq = {} as Request
const mockRes = {} as Response
let validationResult = {} as Joi.ValidationResult
describe('DoctorController', () => {
    let doctorService: DoctorService
    let doctorController: DoctorController
    let validationError: Joi.ValidationError
    let validationErrorItem: Joi.ValidationErrorItem[]
    beforeEach(() => {
        doctorService = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn(),
            getDoctorById: jest.fn(),
            updateDoctor: jest.fn(),
            deleteDoctor: jest.fn()
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
        doctorController = new DoctorControllerImpl(doctorService)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
        validationResult.value = jest.fn().mockReturnThis()
        validationResult.error = validationError
    })

    describe('getAllDoctors', () => {
        it('should get all doctors', async () => {
            // Mock Process
            const doctors: Doctor[] = [
                { id_doctor: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio: 100 },
                { id_doctor: 2, nombre: 'Alveiro', apellido: 'Tarsisio', especialidad: 'Ortopedia', consultorio: 101 },
            ];

            (doctorService.getAllDoctors as jest.Mock).mockResolvedValue(doctors)

            // Method execution
            await doctorController.getAllDoctors(mockReq, mockRes)

            // Asserts
            expect(doctorService.getAllDoctors).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(doctors)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should be handler error and return 400 status', async () => {
            const error = new Error('Internal Server Error');
            (doctorService.getAllDoctors as jest.Mock).mockRejectedValue(error)

            await doctorController.getAllDoctors(mockReq, mockRes)

            expect(doctorService.getAllDoctors).toHaveBeenCalled()
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
            const mockValidation = (validationResult.value as jest.Mock);
            mockValidation.mockReturnValue(doctorReq);
            jest.spyOn(createDoctorSchema, 'validate').mockReturnValue(mockValidation());
            (doctorService.createDoctor as jest.Mock).mockResolvedValue(doctorRes);
            // Method execution

            await doctorController.createDoctor(mockReq, mockRes)
            // Asserts
            expect(createDoctorSchema.validate).toHaveBeenCalledWith(doctorReq)
            expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('should be handler schema error and return 400 status', async () => {
            (mockReq.body) = {};
            const mockValidation = (validationResult.value as jest.Mock);
            mockValidation.mockReturnValue(validationError);
            jest.spyOn(createDoctorSchema, 'validate').mockReturnValueOnce(validationResult);

            await doctorController.createDoctor(mockReq, mockRes)

            expect(createDoctorSchema.validate).toHaveBeenCalledWith({})
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
            jest.spyOn(createDoctorSchema, 'validate').mockReturnValue(mockValidation());
            (doctorService.createDoctor as jest.Mock).mockRejectedValue(error);
            // Method execution

            await doctorController.createDoctor(mockReq, mockRes)
            // Asserts
            expect(createDoctorSchema.validate).toHaveBeenCalledWith(mockReq.body)
            expect(doctorService.createDoctor).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Internal Server Error" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
        it('should be handler service DoctorCreationError and return 400 status', async () => {
            const error = new DoctorCreationError('Failed Creating a doctor');
            // Mock Process
            mockReq.body = {};
            const mockValidation = (validationResult.value as jest.Mock);
            mockValidation.mockReturnValue(mockReq.body);
            jest.spyOn(createDoctorSchema, 'validate').mockReturnValue(mockValidation());
            (doctorService.createDoctor as jest.Mock).mockRejectedValue(error);
            // Method execution

            await doctorController.createDoctor(mockReq, mockRes)
            // Asserts
            expect(createDoctorSchema.validate).toHaveBeenCalledWith(mockReq.body)
            expect(doctorService.createDoctor).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({
                error_name: "DoctorCreationError",
                message: "Failed Creating a doctor"
            })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('getDoctorById', () => {
        it('should get doctor by id', async () => {
            // Mock Process
            const doctorRes: Doctor = { id_doctor: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio: 100 };
            (mockReq.params) = { id: "1" };
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctorRes)

            // Method execution
            await doctorController.getDoctorById(mockReq, mockRes)

            // Asserts
            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should return 400 if doctor not found', async () => {
            (mockReq.params) = { id: "1" };
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(null)

            await doctorController.getDoctorById(mockReq, mockRes)

            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Record has not found yet" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('should return 400 if an error occurs', async () => {
            const error = new Error('Internal Server Error');
            (mockReq.params) = { id: "1" };
            (doctorService.getDoctorById as jest.Mock).mockRejectedValue(error)

            await doctorController.getDoctorById(mockReq, mockRes)

            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to retrieve doctor" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })
})