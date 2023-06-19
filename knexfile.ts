<<<<<<< HEAD
import dotenv from 'dotenv'
=======
import dotenv  from 'dotenv'
>>>>>>> develop

dotenv.config()

console.log(process.env.POSTGRES_URI)
<<<<<<< HEAD
/* module.exports = {
    development: {
        client: 'postgres',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: 'changeme',
            dabase: 'backend',
            port: 5433
        },
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations',
        }
    }
} */

=======
>>>>>>> develop
module.exports = {
    development: {
        client: 'pg',
        connection: process.env.POSTGRES_URI,
<<<<<<< HEAD
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations',
=======
        migrations:{
            directory:'./db/migrations'
>>>>>>> develop
        }
    }
}