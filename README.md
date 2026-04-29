# Burger Master 

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat&logo=railway&logoColor=white)](https://railway.app/)
[![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)](https://git-scm.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/)

Plataforma web de competición de hamburguesas desarrollada como proyecto universitario. Cuatro hamburguesas de Burger Master compiten entre sí mediante un sistema de votación por estrellas (1 a 5). Los usuarios pueden explorar cada hamburguesa en 3D, votar por su favorita y seguir el ranking en tiempo real.

---

## Descripción

Burger Master no es una app de pedidos — es una arena de competición. Cada hamburguesa tiene su propia página con un modelo 3D interactivo que se expande al hacer scroll mostrando sus ingredientes, al estilo de las páginas de producto de Apple. El sistema de votación actualiza el ranking en tiempo real sin necesidad de recargar la página gracias a Supabase Realtime. La autenticación es opcional para navegar, pero obligatoria para votar o comentar. El acceso está segmentado por roles: clientes votan, empleados registran visitas y el admin gestiona el sistema completo.

---

## Tecnologías

- **Node.js** + **Express** — servidor y API REST
- **Supabase** — base de datos PostgreSQL + Realtime para ranking en vivo
- **bcryptjs** — hasheo seguro de contraseñas
- **jsonwebtoken** — autenticación con JWT (expira en 8h)
- **Railway** — despliegue del servidor en producción
- **HTML / CSS / JS** — interfaz de usuario sin frameworks
- **model-viewer** — visualización de modelos 3D (.glb) en el navegador

---

## Funcionalidades principales

- Modelos 3D de cada hamburguesa con animación de expansión controlada por scroll
- Sistema de votación por estrellas (1–5) — un voto por hamburguesa por usuario
- Ranking en tiempo real via Supabase Realtime
- Autenticación con JWT y tres roles: `cliente`, `empleado`, `admin`
- Flujo de registro con aprobación admin para empleados
- Dashboard de admin: gestión de usuarios pendientes y resumen de votaciones
- Dashboard de empleado: registro de visitas por restaurante
- Mapa interactivo de restaurantes participantes
- Filtros por proteína, sabor y ubicación

---

## Roles de usuario

| Rol | Acceso |
|---|---|
| `cliente` | Explorar, filtrar y votar con estrellas |
| `empleado` | Registrar visitas en su propio restaurante |
| `admin` | Acceso total: usuarios, restaurantes, votaciones |

Los admins **no se crean por `/registrar`** — se insertan directamente en la base de datos. Los empleados inician con estado `pendiente` hasta que el admin los aprueba.

---

## Estructura del proyecto

```
Burger_Master/
├── middleware/
│   ├── autenticacion_middleware.js  # Verificación JWT → inyecta req.usuario
│   └── roles_middleware.js          # Factory verificarRol(...roles)
├── routes/
│   ├── auth.routes.js               # POST /registrar, POST /login
│   ├── hamburguesas.routes.js       # GET /hamburguesas, GET /hamburguesas/:id
│   ├── restaurantes.routes.js       # GET /restaurantes, GET /restaurantes/mapa
│   ├── votos.routes.js              # POST /votos, GET /votos/ranking, GET /votos/participantes
│   ├── visitas.routes.js            # POST /visitas, GET /visitas/:restaurante_id
│   └── admin.routes.js              # GET y PATCH /admin/usuarios/*
├── public/
│   ├── hamburguesas/
│   │   ├── hamburguesa-1.html
│   │   ├── hamburguesa-2.html
│   │   ├── hamburguesa-3.html
│   │   └── hamburguesa-4.html
│   ├── css/
│   │   ├── style.css
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js                   # Navbar dinámico + decodificarToken()
│   │   ├── auth-guard.js            # soloAutenticado() y soloRol()
│   │   ├── ranking.js
│   │   ├── mapa.js
│   │   ├── visitas.js
│   │   └── modelo3d.js
│   ├── index.html                   # Landing page principal
│   ├── login.html
│   ├── registro.html
│   ├── ranking.html
│   ├── mapa.html
│   ├── dashboard-empleado.html
│   └── dashboard-admin.html
├── supabase.js                      # Cliente Supabase singleton
├── servidor.js                      # Entry point del servidor
├── .env                             # Variables de entorno (no se sube al repo)
├── .env.example                     # Plantilla de variables
├── .gitignore
├── package.json
├── PROYECTO.md
└── CLAUDE.md
```

---

## Endpoints principales

### Auth
```
POST /registrar     → Crea usuario nuevo
POST /login         → Valida credenciales y retorna JWT
```

### Hamburguesas
```
GET /hamburguesas               → Lista las 4 con promedio de estrellas
GET /hamburguesas/:id           → Perfil individual
GET /hamburguesas?proteina=res  → Filtro por proteína
GET /hamburguesas?sabor=picante → Filtro por sabor
GET /hamburguesas?ciudad=...    → Filtro por ciudad
```

### Votos (Realtime)
```
POST /votos               → Registrar voto (protegido, solo clientes)
GET  /votos/ranking       → Ranking en tiempo real
GET  /votos/participantes → Total usuarios que han votado
```

### Admin
```
GET   /admin/usuarios/pendientes        → Empleados pendientes de aprobación
PATCH /admin/usuarios/:id/aprobar       → Aprobar empleado
PATCH /admin/usuarios/:id/rechazar      → Rechazar y eliminar empleado
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_anon_key
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

---

## Base de datos

El proyecto usa Supabase (PostgreSQL) con las siguientes tablas principales:

- `usuarios` — id, username, password, rol, restaurante_id, estado, created_at
- `restaurantes` — id, nombre, direccion, ciudad, telefono, latitud, longitud
- `hamburguesas` — id, nombre, descripcion, proteina, sabor, restaurante_id
- `votos` — id, usuario_id, hamburguesa_id, estrellas (1–5) | UNIQUE por usuario+hamburguesa | Realtime ON
- `visitas` — id, usuario_id, restaurante_id, fecha_visita | Realtime ON

---

## Autores

| Nombre | Rol |
|---|---|
| **Jorman R. Torres Pertuz** | Backend |
| **Armando Mirando Caicedo** | Frontend |
| **Daniel Stevan Guardo Quintero** | Modelos 3D |
