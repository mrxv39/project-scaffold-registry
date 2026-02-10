
# 30-Second Smoke Test

1. **Backend**
   - `npm test` (all tests pass)
   - `npm run dev` (or `npm start`)
   - `curl http://localhost:3000/health` → expect 200
   - `curl http://localhost:3000/db/health` → expect 200 if DB up, 503 if not

2. **Frontend**
   - `cd web && npm run dev`
   - Open http://localhost:5173/projects
   - Create a project (fill name, submit)
   - See it listed in the projects list

# Developer Smoke Checklist

Quick steps to verify your local environment and DB setup:

1. **Check DATABASE_URL**
   - Ensure your `.env` file has a valid `DATABASE_URL` for Postgres.
   - Example: `DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/project_scaffold_db"`

2. **Generate Prisma Client**
   - Run: `npm run prisma:generate`

3. **Apply DB Migrations**
   - Run: `npm run prisma:migrate:deploy`

4. **Run All Tests**
   - Run: `npm test`
   - Integration tests will be skipped if `DATABASE_URL` is not set.

5. **Check Dev Server Health**
   - Start the dev server: `npm run dev`
   - In another terminal, check health endpoint:
     - `curl http://localhost:3000/health`
   - You should see a healthy response even if the DB is down.

---

If any step fails, check your environment variables and database connection.
