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

