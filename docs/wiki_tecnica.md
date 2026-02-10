# Estado actual del proyecto

- Backend bootstrap completed (Node.js + TypeScript + Express)
- /health endpoint implemented
# Prisma lazy-loading architecture

- PrismaClient is never imported at module load time. Instead, the function `getPrismaClient()` dynamically imports `@prisma/client` only when needed, using `await import("@prisma/client")`.
- This ensures that app startup and the `/health` endpoint do not touch Prisma or the database at all.
- The server can start and respond to `/health` even if the Prisma client is not generated or the database is down.
- Two startup regression tests enforce this:
	- One test ensures importing and starting the app never touches Prisma or the DB.
	- Another test mocks the Prisma accessor to throw if called, and verifies `/health` still works.
- This architecture prevents accidental DB connections or Prisma initialization during startup, making the app robust to missing or broken database state.
# Wiki tÃ©cnica â€“ project-scaffold-registry3

## Arquitectura
- (pendiente)

## MÃ³dulos / carpetas
- (pendiente)

## Funcionalidades (lista)
- (pendiente)

## Decisiones tÃ©cnicas relevantes
- (pendiente)