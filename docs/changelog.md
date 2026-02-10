# Changelog – project-scaffold-registry

## 2026-02-10 — init: estructura del proyecto
ANTES:
- Proyecto sin estructura estándar.

AHORA:
- Archivos base y documentación viva inicializados.

IMPACTO:
- Menos pérdida de contexto y menos “bugs fantasma”.

## 2026-02-10 — scaffold: registry project
ANTES:
- El proyecto registry no existía.

AHORA:
- Proyecto scaffolded y repositorio inicializado.
- Backend base (Node + TS + Express) creado.
- Endpoint `/health` disponible.

IMPACTO:
- Base sólida para continuar el backend en el siguiente sprint.

## 2026-02-10 — refactor: make Prisma lazy and decouple startup from DB
ANTES:
- El servidor podía fallar al arrancar si la DB o Prisma no estaban listos.

AHORA:
- El servidor arranca independientemente de la DB.
- Prisma se inicializa de forma lazy solo cuando se necesita.

IMPACTO:
- Arranque más robusto y despliegues más seguros.

## 2026-02-10 — feat: add Project model to Prisma schema
ANTES:
- No existía un modelo Project en la base de datos.

AHORA:
- Se añadió el modelo Project a Prisma con los campos requeridos y opcionales.
- Se generó el cliente Prisma y se creó la migración inicial para este modelo.

IMPACTO:
- Permite gestionar proyectos en la base de datos y sentar la base para futuras funcionalidades relacionadas con proyectos.


## 2026-02-10 — test infra stabilization
AHORA:
- Integration tests auto-skip without DATABASE_URL.
- Vitest runs in non-watch mode for deterministic CI.
- Regression tests ensure Express boots without touching Prisma.

IMPACTO:
- Stable local development without requiring database setup.