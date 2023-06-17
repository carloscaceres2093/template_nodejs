# Template Node JS
It is a Node JS template struct.
 
## **src** 
Folder principal del aplicativo el cual tiene la gran mayoria la lógica de los componentes y sus respectivas conexiones.
* ### **api** 
    es un sub directorio de src que contiene la lógica de la api rest que convierte a componentes propios de nuestra aplicación, contiene la estructura a continuación 
    * #### **components** 
        contiene el corazón de los componentes, como lo son las rutas, los controladores, los modelos, repositorios, políticas y tests. Los componentes tienen como objetivo representar un proceso importante dentro del desarrollo, como lo puede ser una entidad o casos de uso generales.

        * **clients** son los procesos locales que se encargan de la lógica de comunicación o particularidades del proceso de comunicación con los entes externos. Normalmente son varios procesos como podría ser conexión a una API externa, conexión a un servicio de nube, redis, kafka, etc..

        * **controller.js(ts)** es la clase que maneja los request entrantes y envía la respuesta del back hacia el usuario final.

        * **services.js(ts)** es la clase que tiene toda la lógica

        * **model.js(ts)** representa los modelos de la base de datos para el componente donde se tiene la estructura de datos a usar por componente y es usado normalmente por el repositorio.

        * **repository.js(ts)** es un interpretador para la base de datos y es lo que normalmente se importa como modulo para realizar los procesos de inserción, actualización, selección y borrado de datos sobre la base de datos, es aquí donde el ORM interactúa.

        * **routes.js(ts)** se encarga de la redirección de los endpoints del componente, es el que asigna los métodos del controlador (GET, POST, PUT, etc...).

        * **<component>.spec.js(ts) --opcional** archivo relacionado con los test.

        * **policy.js(ts) - opcional** permite manejar las reglas de accesos a las operaciones (Está basado en roles y se requiere tener un servicio de enrolamiento para poder aplicarle las politicas).


    * #### **middleware ("""opcional""")**
        Contiene todos los procesps de autenticación y validación, login o procesos de auditoria posterior a un request.

        * **logger** configuración propia o especifica del logueo, como lo es la estructura del mensaje, que tipos se requiere, que nivel de alerta se propagará, etc. 
        permite hacer trazabilidad de un request o transacción por medio de un trace id, tambien permite saber que endpoint se está usando.

    * #### **routes.js** 
        Se encarga de registrar todas las rutas que pasan a traves del middleware y de los componentes.

    * #### **server.js** 
        Se inicializa el servicio y se configura absolutamente todo lo que requiera el server de express.
        * Importación de middlewares, componentes, rutas.
        * Manejo de errores.
        * Configuración de puertos.

* ### **config**
    es un directorio que contiene todos los procesos que se encargan de configurar la aplicación a nivel transversal.

    * **variables globales** variables que son globales para toda la aplicación.
    * *BASEPATH*
    * *ENDPOINTS*
    * *PORTS*
    * **ACL (Access Control List)** Lista de control de acceso a la que pueden tener acceso todos mis componentes. 

* ### **test**
    Contienen todos los test generales del funcionamiento de la aplicación y permiten correr los test de cada uno de los componentes.

* ### **utils (opcional)**
    Tiene servicios generales que pueden ser usados por los componentes o cualquier servicio dentro de la app, es importante recalcar que son procesos muy generales y que no deben resolver particularidades del servicio.

* ### **app.js**
    En este archivo se realiza la inicialización del servicio.

## **Pasos de configuración del proyecto:**

1. ejecutamos el comando
    ```
    npm init
    ```
 y nos pedirá los siguientes atributos:
    * name: nombre del proyecto.
    * version: Version del proyecto.
    * Descripción: Descripción breve del proyecto.
    * Entry point: El archivo principal (main) del aplicativo.
    * test command: Si  uno tiene tests anidados, acá se especifica el comando para ejecutarlos.
    * git repository: la ruta del repositorio en el que se encuentra el código.
    * keywords: Palabras claves del proyecto.
    * author: Autor y propietario del proyecto.
    * licence: Especifica una licencia sobre la que se quiere distribuir el proyecto.

2. Instalar typescript con el comando
    ```
    npm install typescript
    ```
3. Instalar dependencias tales como:
    * express: 
        ```
        npm install express
        ```
    * ts-node:
        ```
        npm install ts-node --save-dev
        ```
    * types/express
        ```
        npm install @types/express
        ```
4. Creamos un archivo tsconfig por default:
    ```
    npx tsc --init
    ```
    y luego activamos la opción de **outDir** dentro del archivo y definimos la carpeta que contiene el archivo main (index.ts o app.ts)

5. para correr el proyecto desde el amin se hace con el uso del comando:
    ```
    npx ts-node .\src\app.ts 
    ```

6. Para la migraciones se debe instalar la dependecia del ORM llamado **knex**, donde haremos uso del comando **npm install knex knex-cli pg --save-dev** 

7. Para leer variables de entorno instalamos la libreria de dotenv **npm install dotenv** 

8. configuramos la variable de entorno:
    ``` 
    POSTGRES_URI=postgresql://<usuario_db>:<password_db>@<host_db>:<port_db>/<database>
    ```
9. Creamos el archivo **knexfile.ts** y lo configuramos de la siguiente manera:
    ```
    import dotenv  from 'dotenv'

    dotenv.config()

    console.log(process.env.POSTGRES_URI)
    module.exports = {
        development: {
            client: 'pg',
            connection: process.env.POSTGRES_URI,
            migrations:{
                directory:'./src/db/migrations',
                tableName: 'knex_migrations',
            }
        }
    }
    ```
10. Creamos el archivo de la migración dentro de la carpeta /db/migrations con el siguiente nombramiento:
    ```
    AAAAMMDDHHMMSS_create_<nombreTabla>_table.ts
    ```
    donde:
    ```
    AAAA -> Año 
    MM -> Mes numero
    DD -> Dia numero
    HH -> Hora
    MM -> Minuto
    SS -> Segundo
    ```
    y dentro crearemos dos funciones asincronicas ***up*** para subir la migración
    y otra ***down*** para hacer rollback:
    ```
    import { Knex } from 'knex'

    export async function up(knex:Knex): Promise<void> {
        await knex.raw(
            `
            CREATE TABLE IF NOT EXISTS doctores (
                id_doctor bigserial,
                nombre VARCHAR, 
                apellido VARCHAR, 
                especialidad VARCHAR,
                consultorio VARCHAR,
                correo VARCHAR,
                created_at timestamptz,
                updated_at timestamptz,
                PRIMARY key(id_doctor)
            );
            
            CREATE TABLE IF NOT EXISTS pacientes (
                id_paciente bigserial,
                nombre VARCHAR, 
                apellido VARCHAR, 
                identificacion VARCHAR UNIQUE,
                telefono INT,
                created_at timestamptz,
                updated_at timestamptz,
                PRIMARY key(id_paciente)
            );
            
            CREATE TABLE IF NOT EXISTS citas (
                id_cita bigserial,
                horario VARCHAR,
                especialidad VARCHAR,
                id_doctor BIGINT,
                identificacion_paciente VARCHAR,
                created_at timestamptz,
                updated_at timestamptz,
                PRIMARY key(id_cita),
                CONSTRAINT fk_doctores
                FOREIGN KEY (id_doctor)
                REFERENCES doctores(id_doctor),
                CONSTRAINT fk_pacientes
                FOREIGN KEY (identificacion_paciente)
                REFERENCES pacientes(identificacion)
            );
            `
        )
    }

    export async function down(knex: Knex): Promise<void> {
        await knex.raw(
            `
            DROP TABLE doctores;
            DROP TABLE pacientes;
            DROP TABLE citas;
            `
        )
    }
  
    ```
