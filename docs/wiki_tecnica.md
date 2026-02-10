# Wiki técnica – project-scaffold-registry

## Estado actual
- Backend bootstrap completado (Node.js + TypeScript + Express).
- Endpoint `/health` implementado.
- Prisma desacoplado del arranque (lazy initialization).
- Tests de regresión de arranque y health pasando.

## Arquitectura (alto nivel)
- La app se construye sin tocar base de datos.
- El arranque del servidor está separado de la construcción del `app` (para testear y para evitar side-effects).
- Prisma se inicializa **solo cuando hace falta** (dentro de handlers que lo necesiten), nunca al importar módulos.

## Prisma “lazy” (decisión clave)
- No se importa `PrismaClient` en tiempo de carga de módulos.
- Se usa un accessor (p. ej. `getPrismaClient()`) que hace `await import("@prisma/client")` de forma dinámica.
- Beneficios:
	- El servidor arranca aunque Prisma no esté generado o la DB esté caída.
	- `/health` no depende de DB (sirve para readiness/liveness básicos).
	- Evita crashes por inicialización temprana de Prisma.

## Módulos / carpetas (referencia)
- `src/` código fuente
- `src/db/` acceso a datos (incluye el accessor lazy de Prisma)
- `src/**` rutas/handlers (no deben importar PrismaClient directamente)
- `src/*.test.ts` tests (Vitest)

## Tests que blindan el comportamiento
- `src/startupRegression.test.ts`
	- Verifica que el servidor/app responde `/health` con 200 y que no se toca Prisma durante el arranque.
- `src/startupPrismaMissingRegression.test.ts`
	- Mockea el accessor de Prisma para que lance error si se llama, y valida que `/health` sigue funcionando.

## DB Integration Tests Strategy
- Integration tests use a helper `describeDb` located in test/utils/db.ts
- Tests requiring DATABASE_URL are automatically skipped if the variable is not present
- This prevents local crashes and allows CI to run without a database
- Vitest runs in non-watch mode for deterministic exits
## Decisiones técnicas relevantes
- Separar “construir app” vs “escuchar en puerto” para:
	- tests deterministas
	- arranque sin side-effects
	- despliegues más robustos

- Mantener `/health` libre de dependencias externas.

## Estrategia de tests de integración
- Las pruebas de integración que usan Prisma requieren la variable de entorno `DATABASE_URL`.
- Se utiliza el helper `describeDb()` en `test/utils/db.ts` para envolver los tests dependientes de base de datos.
- Si `DATABASE_URL` no está presente, estos tests se omiten automáticamente, evitando errores locales y permitiendo que CI corra sin base de datos.
- El endpoint `/db/health` **no está implementado aún**; los tests relacionados están marcados como TODO o se omiten con `it.skip`.

## Cómo validar localmente
- Tests: `npm test`
- Build/typecheck: `npm run build`