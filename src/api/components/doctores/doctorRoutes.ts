import express, { Router, Request, Response } from 'express'
import logger from '../../../utils/logger'

const router = Router()

router.get('', (req: Request, res: Response) => {
    
    const doctores = [
        {id_doctor: 1, nombre: 'John', apellido: 'Doe', especialidad: 'Pediatría', consultorio: 101, correo: 'john.doe@123.4'},
        {id_doctor: 1, nombre: 'Jose', apellido: 'Rodrigez', especialidad: 'Medicina General', consultorio: 102, correo: 'josesitoLove@123.4'},
    ]
    logger.info(req.rawHeaders)
    res.json(doctores)
}
)

export default router