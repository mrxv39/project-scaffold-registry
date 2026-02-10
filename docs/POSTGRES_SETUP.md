# Postgres local setup (Docker)

To run a local Postgres instance for development:

```
docker run -d \
  --name psr-postgres \
  -e POSTGRES_USER=psr \
  -e POSTGRES_PASSWORD=psr \
  -e POSTGRES_DB=project_scaffold_db \
  -p 55432:5432 \
  -v psr_pgdata:/var/lib/postgresql/data \
  postgres:16
```

- Container name: `psr-postgres`
- Image: `postgres:16`
- Host port: `55432` (change if needed)
- Container port: `5432`
- Data volume: `psr_pgdata` (persists DB data)

To stop and remove:
```
docker stop psr-postgres && docker rm psr-postgres
```

You can now set your `DATABASE_URL` in `.env` or your environment:
```
DATABASE_URL="postgresql://psr:psr@localhost:55432/project_scaffold_db"
```

See [docs/wiki_tecnica.md](docs/wiki_tecnica.md) for more details.
