import { Doctor, DoctorReq } from "../api/components/doctores/model"
import { DoctorRepository } from "../api/components/doctores/repository"
import { DoctorService, DoctorServiceImpl } from "../api/components/doctores/service"

describe('DoctorService', () => {
    let doctorService: DoctorServiceImpl
    let doctorRepository: DoctorRepository

    beforeEach(() => {
        doctorRepository = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn()
        }
        doctorService = new DoctorServiceImpl(doctorRepository)
    })

    describe('getAllDoctors', () => {
        it('should get all doctors', async () => {
            //Mock Process
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
            (doctorRepository.getAllDoctors as jest.Mock).mockReturnValue(doctors);
            const result = await doctorService.getAllDoctors();

            expect(doctorRepository.getAllDoctors).toHaveBeenCalledWith(doctors)
            expect(result).toEqual(doctors)
        })

        it('should return an empty array', async () => {
            //Mock Process
            (doctorRepository.getAllDoctors as jest.Mock).mockReturnValue([])
            const result = await doctorService.getAllDoctors()

            expect(doctorRepository.getAllDoctors).toHaveBeenCalledWith([])
            expect(result).toEqual([])
        })
    })
    describe('createDoctor', () => {
        it('should create a new doctor', async () => {
            //Mock Process
            const doctor: Doctor =
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
            (doctorRepository.createDoctor as jest.Mock).mockReturnValue(doctor)
            const result = await doctorService.createDoctor(doctorReq)

            expect(doctorRepository.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(result).toEqual(doctor)
        })

        it('should return an error if doctor creation fails', async () => {
            //Mock Process
            const doctorReq: DoctorReq =
            {
                nombre: 'Carlos',
                apellido: 'Caceres',
                especialidad: 'Medicina General',
                consultorio: 100
            };
            const error = new Error(`Error creating doctor: ${JSON.stringify(doctorReq)}`);
            (doctorRepository.createDoctor as jest.Mock).mockReturnValue(error)
            const result = await doctorService.createDoctor(doctorReq)

            expect(doctorRepository.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(result).rejects.toThrowError(error)
        })
    })
})