import dotenv from 'dotenv'

dotenv.config()

console.log(process.env.POSTGRES_URI)
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

module.exports = {
    development: {
        client: 'pg',
        connection: process.env.POSTGRES_URI,
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations',
        }
    }
}