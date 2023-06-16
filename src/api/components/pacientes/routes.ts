import  { Router} from 'express'
import logger from '../../../utils/logger'
import { PatientController, PatientControllerImpl } from './controller'
import { PatientServiceImpl } from './service'


const router = Router()
const patientService = new PatientServiceImpl()
const patientController: PatientController = new PatientControllerImpl(patientService)


router.get('',  patientController.getPatient.bind(patientController))
router.post('/create',  patientController.createPatient.bind(patientController))

export default router