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