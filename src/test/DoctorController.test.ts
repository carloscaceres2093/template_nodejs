import { Request, Response } from "express"
import { DoctorController, DoctorControllerImpl } from "../api/components/doctores/controller"
import { DoctorService, DoctorServiceImpl } from "../api/components/doctores/service"
import { DoctorRepository } from "../api/components/doctores/repository"
import { Doctor, DoctorReq } from "../api/components/doctores/model"

import chai from 'chai'
import chaiHttp from 'chai-http'
import spies from 'chai-spies'

chai.use(chaiHttp)
chai.use(spies)

const expect = chai.expect


const doctorRepositoryMock: DoctorRepository = {
    createDoctor:async (req: DoctorReq) => {
        const doctor: Doctor = {
            id_doctor: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio: 100
        }
        return doctor
    },
    getAllDoctors:async () => {
        const doctor: Doctor[] = [
            {id_doctor: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio: 100}]
        return doctor
    },
}

const doctorService: DoctorService = new DoctorServiceImpl(doctorRepositoryMock)
const doctorController: DoctorController = new DoctorControllerImpl(doctorService)

// Mocking  Express request y el objeto del response

const reqMock = {} as Request
// const resMock = {
//     json: chai.spy(),
//     status: () => resMock,
// } as unknown as Response

const resMock: Response<any> = {
    json: chai.spy(),
    status: chai.spy(),
}  as unknown as Response<any>
// const resMock = chai.spy.interface<Response>(['json', 'status'])

describe('DoctorController', () => {
    describe('getAllDoctors', () => {
        it("should be get all doctors", async () => {
            await doctorController.getAllDoctors(reqMock, resMock)
            expect(resMock.json).to.have.been.called.once;
            expect(resMock.status).to.have.been.called.with(200)
            expect(resMock.json).to.have.been.called.with(
                [
                    {id_doctor: 1, nombre: 'Carlos', apellido: 'Caceres', especialidad: 'Medicina General', consultorio: 100}
                ]
            )
        })

        // it('should handle errors and send error response', async () => {
        //     const error = new Error('Dabase Error')
        //     //doctorRepositoryMock.getAllDoctors = 
        //     doctorRepositoryMock.getAllDoctors = async () => {
        //         throw error
        //     }
        //     await doctorController.getAllDoctors(reqMock, resMock)
        //     console.log(resMock.json)
        //     //expect(resMock.status).to.have.been.called.with(400)
        //     expect(resMock.json).to.have.been.called.with({
        //         message: 'Internal Server Error'
        //     })

        // })
    }) 
})