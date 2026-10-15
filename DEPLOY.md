# Deploying the Study Planner

The app is a standard Node.js server: one process serves the API and the built
React client. It needs a PostgreSQL database. There is nothing Replit-specific
in it.

## Requirements

- Node.js 20 or newer
- PostgreSQL 13 or newer (a managed database from any host is fine)
- npm

## Environment variables

Copy `.env.example` to `.env` and fill it in, then export the values in your
shell (the app does not read `.env` by itself), or set them in your hosting
provider's dashboard.

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes in production | Any long random string; the server refuses to start without it |
| `PORT` | No | Defaults to 5000 |
| `NODE_ENV` | Yes for a server | Use `production` when running the built app |
| `ANTHROPIC_API_KEY` | No | Only for the "generate questions from a file" feature |

## First deployment

```bash
npm ci              # install exact dependency versions
npm run db:push     # create the database tables
npm run build       # build the client and server into dist/
npm start           # start the server (NODE_ENV=production)
```

The site is then served on `http://<host>:<PORT>`.

## Updating

```bash
npm ci
npm run db:push     # only if the database schema changed
npm run build
npm start
```

## Notes

- The server keeps `node_modules` at runtime: `npm start` runs `dist/index.cjs`
  and a few dependencies are loaded from `node_modules` (the PostgreSQL session
  store reads one of its files at runtime).
- Sessions are stored in PostgreSQL, so sign-ins survive a restart and work
  across more than one server instance.
- Put the app behind HTTPS. The session cookie is marked `Secure` in
  production, so it is only sent over HTTPS. The server trusts
  `X-Forwarded-Proto` from the proxy in front of it, which most hosts set.
- Health check: `GET /` returns the app's HTML page.
