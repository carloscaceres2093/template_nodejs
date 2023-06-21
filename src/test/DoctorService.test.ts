import { Doctor, DoctorReq } from "../api/components/doctores/model"
import { DoctorServiceImpl } from "../api/components/doctores/service"
import { DoctorRepository } from "../api/components/doctores/repository"


describe('DoctorService', () => {
    let doctorSerivce: DoctorServiceImpl
    let doctorRepository: DoctorRepository

    beforeEach( () => {
        doctorRepository = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn()
        }

        doctorSerivce = new DoctorServiceImpl(doctorRepository)
    })

    describe('getAllDoctors', () => {
        it('should get all doctors from service', async () => {
            // Mock Process
            const doctors: Doctor[] = [
                {id_doctor: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100},
            ];

            (doctorRepository.getAllDoctors as jest.Mock).mockResolvedValue(doctors)

            // Method execution
            const result  = await doctorSerivce.getAllDoctors()

            // Asserts
            expect(doctorRepository.getAllDoctors).toHaveBeenCalled()
            expect(result).toEqual(doctors)
        })
        it('should return an empty array when no doctors are found', async () => {
            // Mock Process
            (doctorRepository.getAllDoctors as jest.Mock).mockResolvedValue([])

            // Method execution
            const result  = await doctorSerivce.getAllDoctors()

            // Asserts
            expect(doctorRepository.getAllDoctors).toHaveBeenCalled()
            expect(result).toEqual([])
        })
    })

    describe('createDoctor', () => {
        it('should create a new doctor and return it from  service', async () => {
            // Mock Process
            const doctorRes: Doctor = {id_doctor: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100}
            const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};

            (doctorRepository.createDoctor as jest.Mock).mockResolvedValue(doctorRes)

            // Method execution
            const result  = await doctorSerivce.createDoctor(doctorReq)

            // Asserts
            expect(doctorRepository.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(result).toEqual(doctorRes)
        })
        //TODO: Fix error service handler
        // it('should throw and error if doctor creation fails', async () => {
        //     // Mock Process
        //     const doctorReq: DoctorReq = {nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio:100};
        //     const error = new Error('Failed to create doctor');
        //     (doctorRepository.createDoctor as jest.Mock).mockRejectedValue(error)

        //     // Method execution
        //     const result  = await doctorSerivce.createDoctor(doctorReq)

        //     // Asserts
        //     expect(result).rejects.toThrowError(error)
        //     expect(doctorRepository.createDoctor).toHaveBeenCalledWith(doctorReq)
        // })
    })
})