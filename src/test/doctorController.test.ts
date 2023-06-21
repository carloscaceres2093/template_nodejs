import { Request, Response } from "express";
import { DoctorController, DoctorControllerImpl } from "../api/components/doctores/controller";
import { DoctorService, DoctorServiceImpl } from "../api/components/doctores/service";
import { Doctor, DoctorReq } from "../api/components/doctores/model";

const mockReq = {} as Request
const mockRes = {} as Response

describe('Doctor Controller', () => {
    let doctorService: DoctorService
    let doctorController: DoctorController

    beforeEach(() => {
        doctorService = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn()
        }
        doctorController = new DoctorControllerImpl(doctorService)
        mockRes.status = jest.fn().mockReturnThis() //retorna todo lo que se le pase como argumento.
        mockRes.json = jest.fn().mockReturnThis()//retorna todo lo que se le pase como argumento.
    })

    describe('getAllDoctors', () => {
        it('should get all doctors', async () => {
            const doctors: Doctor[] = [
                {
                    id_doctor: 1,
                    nombre: 'Carlos',
                    apellido: 'Caceres',
                    especialidad: 'Medicina General',
                    consultorio: 100
                },
                {
                    id_doctor: 2,
                    nombre: 'Sergio',
                    apellido: 'Gomez',
                    especialidad: 'Ortopedia',
                    consultorio: 101
                }
            ];
            (doctorService.getAllDoctors as jest.Mock).mockReturnValue(doctors) //El service mockeado retorna el array de doctores al controller
            await doctorController.getAllDoctors(mockReq, mockRes)
            expect(doctorService.getAllDoctors).toHaveBeenCalled()//prueba que el service se llame desde el controlador una sola vez.
            expect(mockRes.json).toHaveBeenCalledWith(doctors)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('should be handler error and return 400 status', async () => {
            //configuramos y mockeamos el error.
            const error = new Error('Internal Server Error');
            (doctorService.getAllDoctors as jest.Mock).mockRejectedValue(error)
            //ejecutamos el controller que es nuestro objeto de pruebas.
            await doctorController.getAllDoctors(mockReq, mockRes)
            //hacemos las validaciones finales.
            expect(doctorService.getAllDoctors).toHaveBeenCalled()//prueba que el service se llame desde el controlador una sola vez.
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Error consultando doctor." })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })
    describe('createDoctor', () => {
        it('should create a new doctor and return info', async () => {
            //Mock Process
            const doctors: Doctor =
            {
                id_doctor: 1,
                nombre: 'Carlos',
                apellido: 'Caceres',
                especialidad: 'Medicina General',
                consultorio: 100
            };
            const doctorReq: DoctorReq = {
                nombre: 'Carlos',
                apellido: 'Caceres',
                especialidad: 'Medicina General',
                consultorio: 100
            };
            (mockReq.body as DoctorReq) = doctorReq;
            (doctorService.createDoctor as jest.Mock).mockReturnValue(doctors)
            await doctorController.createDoctor(mockReq, mockRes)
            expect(doctorService.createDoctor).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(doctors)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('should be handler error and return 400 status', async () => {
            //configuramos y mockeamos el error.
            const error = new Error('Internal Server Error');
            (doctorService.createDoctor as jest.Mock).mockRejectedValue(error)
            //ejecutamos el controller que es nuestro objeto de pruebas.
            await doctorController.createDoctor(mockReq, mockRes)
            //hacemos las validaciones finales.
            expect(doctorService.createDoctor).toHaveBeenCalled()//prueba que el service se llame desde el controlador una sola vez.
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Error creando doctor." })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })
})