import express, { Request, Response } from 'express';

const app = express()
const port = 8087

//Crea un middleware para convertir
//todos los bodies de los request en JSON

app.use(express.json())
app.get('/api/v1/doctores', (req: Request, res: Response) => {
    const doctores = [
        { id_doctor: 1, nombre: 'John', apellido: 'Doe', especialidad: 'Pediatría', consultorio: 101, correo: 'john.doe@123.4' },
        { id_doctor: 2, nombre: 'Jose', apellido: 'Doerty', especialidad: 'Cardiología', consultorio: 102, correo: 'jose.doerty@123.4' }
    ]
    res.json(doctores)
}
)

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})