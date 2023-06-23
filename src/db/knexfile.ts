import dotenv  from 'dotenv'

dotenv.config()

module.exports = {
    development: {
        client: 'pg',
        connection: process.env.POSTGRES_URI,
        migrations:{
            directory:'./migrations',
            tableName: 'knex_migrations',
        }
    }
}

// module.exports = {
//     development: {
//       client: 'pg',
//       connection: {
//         host: 'localhost',
//         user: 'postgres',
//         password: 'Jadmec06',

//         database: 'gestion_citas',
//             port: 5432,
//       },
//       migrations:{
//                     directory:'./migrations',
//                     tableName: 'knex_migrations',
//                 }
//     },
//   };