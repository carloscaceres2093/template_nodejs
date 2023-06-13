# template_nodejs
It is a Node JS template struct.

## SCR

Folder principal del aplicativo el cual contiene la lógica pertienente de los componentes y sus respectivas conexiones.

En **scr** tendremos una estrucutra compuesta por lo siguiente

### API

Api contendrá los componentes propios del aplicativo REST de Node y a su vez tendrá la siguiente estructura

#### Components

Se tiene el corazón de los componentes, como lo son las rutas, los controladores, modelos, repositorios, políticas y test.
Donde un componente tiene como objetivo representar un proceso importante dentro del desarrollo, como lo puede ser una entidad o casos de usos generales.

* **clients** que son los procesos locales que se encargan de la lógica de comunicación o particularidades del procesos de comunicación con los entes externos. Normalment son varios procesos como podría ser conexión a una API externa, conexión a un servicio de nube, redis, kafka etc.

* **controller.js(ts)** es la clase que maneja los request entrantes y envia la respuesta del back hacia el usuario final
* **service.js(ts)** Se encargará de toda la lógica propia del componente.

* **model.js(ts)** representa los modelos de la base de datos para el componente, donde se tiene la estructura de datos a usar por componente y es usado normalmente por el repositorio

* **repository.js(ts)** es un interpretador para la base datos y es lo que normalmente se importa como modolo para realizar los procesos de inserción, actualización, selección y borrado de datos sobre la base de datos, es aquí donde el ORM interactua.

* **routes.js(ts)** la redirección de los endpoints del componente, que el que asigna los metodos del controlador.

* **<component>.spec.js(ts) --opcional** archivo relacionado con los test.

* **policy.js(ts) --opcional** permite manejar las reglas de acceso a las operaciones (Está basado en roles)

#### Middleware ("""opcional""")
Carpeta que contiene todos los proceso de autenticación y validación, loggin o procesos de auditoría posterior a un request.

#### routes.js
Es el que se encarga de registrar todas las rutas que pasan a través del middleware y de los componentes.

#### server.js
Es donde se inicializa el servicio y se configura absolutamente todo lo que requiera el servidor de express.
* Importación de middlewares, componentes, rutas
* Manejo de errores
* Configuraciones de puertos

### config

Es un directorio que contiene todos los proceso que se encargan de configurar la aplicación a nivel transversal.

* **variables globales** variables que son globales para toda la aplicación.
* **logger** configuración propia o especifica de el logueo, como lo es la estructura del mensaje, que tipos se quiere, que nivel de alerta se propagará, etc.

* **ACL (Access Control List)** Lista de control de acceso.

### test

Son test que pemiten correr los test de cada uno de los componentes.

### app.js
En este archivo se realiza la inicialización del servicio.

### utils (opcional)
Tiene serivicios generales que pueden ser usados por los componentes o caulquier servicio dentro del aplicativo, es importante recalcar que son procesos muy generales y que no deben resolver particularidades del servicio.
