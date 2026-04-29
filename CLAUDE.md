# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Start the server (runs on http://localhost:3000)
node servidor.js
```

No test suite exists. There is no build step — the server serves static files directly from `public/`.

## Architecture

**Burger Master** is a hamburger competition voting platform (not an ordering app). Four burgers compete via 1–5 star ratings.

### Backend — Node.js + Express (CommonJS)

Entry point: `servidor.js`. All routes are registered there.

- `supabase.js` — singleton Supabase client, imported by all routes
- `middleware/autenticacion_middleware.js` — JWT verification; injects `req.usuario` (`{ id, username, rol, restaurante_id }`)
- `middleware/roles_middleware.js` — factory `verificarRol(...roles)`, always chained after auth middleware
- `routes/` — one file per resource group (`auth`, `hamburguesas`, `restaurantes`, `votos`, `visitas`, `admin`)

**Route protection pattern:**
```js
router.post('/ruta', verificarToken, verificarRol('cliente'), async (req, res) => { ... });
```

### Frontend — Vanilla HTML + JS, no framework

Served statically from `public/`. No bundler.

- `public/js/app.js` — shared across all pages: `decodificarToken()` helper, navbar session logic (show/hide `#nav-invitado` / `#nav-usuario`), login and register form handlers
- `public/js/auth-guard.js` — `soloAutenticado()` and `soloRol(...roles)` redirect helpers, called inline in protected pages
- Page-specific logic lives either in inline `<script>` at the bottom of the HTML or in dedicated JS files (`ranking.js`, `hamburguesa.js`, etc.)
- Token stored in `localStorage` as `token`; decoded client-side via `atob(token.split('.')[1])`
- `API_URL` is hardcoded as `'http://localhost:3000'` in `app.js`

### Database — Supabase (PostgreSQL)

Key constraints:
- `votos`: `UNIQUE(usuario_id, hamburguesa_id)` — duplicate vote returns Supabase error `23505` → respond `409`
- `usuarios.estado`: `'activo'` for clients; `'pendiente'` for employees until admin approves
- `admin` role cannot be created via `/registrar` — must be inserted directly in the DB
- Star average is calculated in JS, not via Supabase RPC

### Roles

| Role | Access |
|---|---|
| `cliente` | View and vote |
| `empleado` | Register visits for their own `restaurante_id` only |
| `admin` | Full access to all restaurants and users |

Employees can only see visits for `req.usuario.restaurante_id` — validated in the route, not just via role middleware.

## Environment variables (`.env`)

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
JWT_SECRET=
PORT=3000
```

JWT expires in `8h`. CORS origins are read from `CORS_ORIGIN` (comma-separated) or default to `http://localhost:3000`.
