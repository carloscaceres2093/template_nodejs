import { knex } from 'knex'
import dotenv  from 'dotenv'

dotenv.config()

export const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        database: 'gestion_citas',
        user: 'postgres',
        password: 'Jadmec06',
    },
})

export default db