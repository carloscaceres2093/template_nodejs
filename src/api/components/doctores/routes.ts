import express, { Router} from 'express'
import logger from '../../../utils/logger'
import { DoctorController, DoctorControllerImpl } from './controller'
import { DoctorServiceImpl } from './service'


const router = Router()
const doctorService = new DoctorServiceImpl()
const doctorController: DoctorController = new DoctorControllerImpl(doctorService)


router.get('',  doctorController.getAllDoctors.bind(doctorController))
router.post('/create',  doctorController.createDoctor.bind(doctorController))

export default router