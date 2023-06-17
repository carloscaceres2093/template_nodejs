import express, { Router } from 'express'
import doctorRoutes from './components/doctores/routes'
import citaRoutes from './components/citas/routes'
import pacienteRoutes from './components/pacientes/routes'
// import citaRoutes from './components/doctores/citaRoutes'

const router = Router()

router.use('/doctores', doctorRoutes)
router.use('/citas', citaRoutes)
router.use('/pacientes', pacienteRoutes)
// router.use('/citas', citaRoutes)

export default router