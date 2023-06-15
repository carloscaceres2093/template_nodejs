import express, { Router } from 'express'
import doctorRoutes from './components/doctores/doctorRoutes'
// import citaRoutes from './components/doctores/citaRoutes'

const router = Router()

router.use('/doctores', doctorRoutes)
// router.use('/citas', citaRoutes)

export default router