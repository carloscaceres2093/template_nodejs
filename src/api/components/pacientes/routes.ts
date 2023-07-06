import { Router } from 'express'
import { PatientController, PatientControllerImpl } from './controller'
import { PatientRepository } from './repository'
import { PatientServiceImpl } from './service'
import { AppointmentRepository } from '../citas/repository'


const router = Router()
const patientRepository = new PatientRepository()
const appointmentRepository = new AppointmentRepository()
const service = new PatientServiceImpl(patientRepository, appointmentRepository)
const controller: PatientController = new PatientControllerImpl(service)


router.get('', controller.getAllPatient.bind(controller))
router.post('/create', controller.createPatient.bind(controller))
router.get('/:id', controller.getPatientById.bind(controller))
router.put('/:id', controller.updatePatient.bind(controller))
router.delete('/:id', controller.deletePatient.bind(controller))



export default router