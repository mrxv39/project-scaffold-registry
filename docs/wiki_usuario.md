# Wiki de usuario – project-scaffold-registry

## Qué es esta app
project-scaffold-registry es un servicio para registrar y consultar proyectos creados con un scaffold, con el objetivo de centralizar estado y metadatos.


## Cómo usar la página de proyectos

- Abre la página de proyectos en desarrollo: http://localhost:5173/projects
- Para crear un proyecto, escribe un nombre en el campo y haz clic en "Create".
- Si la base de datos no está configurada, verás el mensaje "Database not configured" y el formulario estará deshabilitado.
- El listado de proyectos se actualiza automáticamente al crear uno nuevo.
- El endpoint `/health` sigue funcionando aunque la base de datos no esté disponible.

## Comprobación rápida: /health
Existe un endpoint de salud:

- `GET /health`

Este endpoint sirve para comprobar que el servidor está levantado y funcionando.


**Importante:** `/health` responde correctamente incluso si la base de datos no está disponible. Esto permite verificar el servicio sin depender de la DB.

> Nota: `/db/health` estará disponible en próximas versiones para comprobar la conexión con la base de datos.


## Cómo arrancar (nivel usuario técnico)
1) Instala dependencias: `npm install`
2) Consulta scripts disponibles: `npm run`
3) Ejecuta el script de arranque que tenga el proyecto (por ejemplo `npm run dev` o `npm start` si existen)

### Nota sobre tests
- Algunas pruebas requieren base de datos.
- Si DATABASE_URL no está configurado, esas pruebas se omiten automáticamente.

## Funcionalidades previstas (alto nivel)
- Listado de proyectos y su estado
- Categorías y etiquetas
- Integración con GitHub
- Soporte multiusuario

