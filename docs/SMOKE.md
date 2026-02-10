# Quick API smoke checks

Copy-paste these commands to verify backend endpoints:

```
curl http://localhost:3000/health
curl http://localhost:3000/db/health
curl http://localhost:3000/api/projects
```

PowerShell POST example:

```
Invoke-RestMethod -Method Post `
   -Uri "http://localhost:3000/api/projects" `
   -ContentType "application/json" `
   -Body '{"name":"Smoke-UI","category":"test","tags":["smoke"]}'
```

# 30-Second Smoke Test

1. **Backend**
   - `npm test` (all tests pass)
   - `npm run dev` (or `npm start`)
   - `curl http://localhost:3000/health` → expect 200
    - `curl http://localhost:3000/db/health` 
       - Expect **200** and `{ "status": "ok", "db": "ok" }` when the Postgres container (port 55432) is running and DATABASE_URL is set
       - Expect **503** and `{ "status": "db_unavailable", "reason": "DATABASE_URL missing" }` when DATABASE_URL is missing

2. **Frontend**
   - `cd web && npm run dev`
   - Open http://localhost:5173/projects
   - Create a project (fill name, submit)
   - See it listed in the projects list

# Developer Smoke Checklist

Quick steps to verify your local environment and DB setup:

1. **Check DATABASE_URL**
   - Ensure your `.env` file has a valid `DATABASE_URL` for Postgres.
   - Example: `DATABASE_URL="postgresql://psr:psr@localhost:55432/project_scaffold_db"` (default for psr-postgres Docker container)

2. **Generate Prisma Client**
   - Run: `npm run prisma:generate`

3. **Apply DB Migrations**
   - Run: `npm run prisma:migrate:deploy`

4. **Run All Tests**
   - Run: `npm test`
   - Integration tests will be skipped if `DATABASE_URL` is not set.

5. **Check Dev Server Health**
   - Start the dev server: `npm run dev`
    - In another terminal, check health endpoints:
       - `curl http://localhost:3000/health` (should always return 200 if server is up)
       - `curl http://localhost:3000/db/health` (returns 200 if DB is up, 503 if not configured or unreachable)
    - `/health` is DB-independent; `/db/health` checks DB readiness.

---

If any step fails, check your environment variables and database connection.
