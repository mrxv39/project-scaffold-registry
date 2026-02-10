# Wiki de usuario – project-scaffold-registry

## Qué es esta app
project-scaffold-registry es un servicio para registrar y consultar proyectos creados con un scaffold, con el objetivo de centralizar estado y metadatos.

## Estado actual
Todavía no hay interfaz web ni funcionalidades de negocio expuestas (más allá de checks básicos).

## Comprobación rápida: /health
Existe un endpoint de salud:

- `GET /health`

Este endpoint sirve para comprobar que el servidor está levantado y funcionando.

**Importante:** `/health` responde correctamente incluso si la base de datos no está disponible. Esto permite verificar el servicio sin depender de la DB.


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

## QuÃ© es esta app
project-scaffold-registry es una aplicación web centralizada para gestionar y visualizar proyectos scaffolded.

## CÃ³mo empezar
Actualmente no hay interfaz de usuario ni interacción disponible.

Nota: El servicio puede iniciarse y responder a la ruta /health aunque la base de datos no esté disponible. Esto permite comprobar fácilmente si la aplicación está funcionando, incluso si hay problemas con la base de datos.

## Funcionalidades
Funcionalidades previstas (alto nivel):
  - Listado de proyectos y su estado
  - Categorías y etiquetas
  - Integración con GitHub
  - Soporte multiusuario