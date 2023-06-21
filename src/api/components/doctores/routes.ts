import express, { Router } from 'express'
import logger from '../../../utils/logger'
import { DoctorController, DoctorControllerImpl } from './controller'
import { DoctorServiceImpl } from './service'
import { DoctorRepository } from './repository'


const router = Router()
const doctorRepository = new DoctorRepository
const doctorService = new DoctorServiceImpl(doctorRepository)
const doctorController: DoctorController = new DoctorControllerImpl(doctorService)


router.get('', doctorController.getAllDoctors.bind(doctorController))
router.post('/create', doctorController.createDoctor.bind(doctorController))

export default router