# Wiki de usuario – project-scaffold-registry

## Qué es esta app
project-scaffold-registry es un servicio para registrar y consultar proyectos creados con un scaffold, con el objetivo de centralizar estado y metadatos.



- Abre la página de proyectos en desarrollo: http://localhost:5173/projects
- Para crear un proyecto, escribe un nombre en el campo y haz clic en "Create".
- Si la base de datos no está configurada, verás el mensaje "Database not configured" y el formulario estará deshabilitado.
- El listado de proyectos se actualiza automáticamente al crear uno nuevo.
- El endpoint `/health` sigue funcionando aunque la base de datos no esté disponible.


### Consultar o eliminar un proyecto específico
Puedes ver o eliminar un proyecto concreto usando:
- `GET /api/projects/:id` para consultar
- `DELETE /api/projects/:id` para eliminar

Si el proyecto no existe, la respuesta será "not_found".
Si la base de datos no está configurada, verás un mensaje de "db_unavailable".
Al eliminar, si el proyecto existe se devuelve 204 (sin contenido); si no existe, 404.


## Comprobación rápida: /health y /db/health
Existen dos endpoints de salud:

- `GET /health`: comprueba que el servidor está levantado (no depende de la base de datos).
- `GET /db/health`: comprueba si la base de datos está disponible y lista.

Usa `/db/health` para saber si la app puede conectarse a la base de datos (útil para despliegues y monitoreo). Si la base de datos no está configurada o no responde, este endpoint devuelve un error 503.


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

