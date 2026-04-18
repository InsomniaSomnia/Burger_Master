# Burger Master — Backend

## Descripción
Plataforma web de competición de hamburguesas. NO es una app de pedidos.
Es un sistema de votación donde 4 hamburguesas compiten entre sí mediante
calificación por estrellas (1 a 5). Un usuario puede votar todas las
hamburguesas pero no puede votar la misma dos veces.

## Stack
- Node.js + Express
- Supabase (PostgreSQL + Realtime + Storage)
- JWT para autenticación
- bcryptjs para contraseñas

## Roles de usuario
- cliente → puede ver, filtrar y votar con estrellas
- empleado → registra visitas manualmente en su restaurante
- admin → ve todo, todos los restaurantes y usuarios

## Base de datos

### Tablas
- usuarios → id, username, password, rol, restaurante_id FK, estado ('activo'|'pendiente'), created_at
- restaurantes → id, nombre, direccion, ciudad, telefono, imagen_url, latitud, longitud
- hamburguesas → id, nombre, descripcion, imagen_url, qr_url, proteina, sabor, disponible, restaurante_id FK
- multimedia → id, hamburguesa_id FK, tipo (imagen/video), url, created_at
- votos → id, usuario_id FK, hamburguesa_id FK, estrellas (1-5), created_at | UNIQUE(usuario_id, hamburguesa_id) | Realtime ON
- visitas → id, usuario_id FK, restaurante_id FK, fecha_visita | Realtime ON

### Reglas importantes
- votos: CHECK(estrellas >= 1 AND estrellas <= 5)
- votos: UNIQUE(usuario_id, hamburguesa_id) → no puede votar la misma hamburguesa 2 veces
- visitas Realtime: solo visible para empleado de ese restaurante y admins
- usuarios.restaurante_id → NULL si es cliente o admin
- usuarios.estado → 'activo' por defecto para clientes; 'pendiente' para empleados hasta aprobación admin
- admins NO se crean por /registrar → se insertan directamente en la base de datos

## Endpoints

### Auth
- POST /registrar → crea usuario nuevo con bcrypt
- POST /login → valida credenciales y retorna JWT

### Hamburguesas
- GET /hamburguesas → lista las 4 con promedio de estrellas y total votos
- GET /hamburguesas/:id → perfil individual de la hamburguesa
- GET /hamburguesas?proteina=res → filtro por tipo de proteína
- GET /hamburguesas?sabor=picante → filtro por sabor
- GET /hamburguesas?ciudad=cartagena → filtro por ubicación

### Restaurantes
- GET /restaurantes → directorio completo de restaurantes
- GET /restaurantes/mapa → retorna id, nombre, latitud, longitud para mapa interactivo

### Votos
- POST /votos → registrar voto con estrellas (protegido, solo clientes autenticados)
- GET /votos/ranking → promedio estrellas + total votos por hamburguesa ordenado desc (Realtime)
- GET /votos/participantes → total usuarios distintos que han votado

### Visitas
- POST /visitas → registrar visita manualmente (protegido, solo empleados)
- GET /visitas/:restaurante_id → flujo de clientes de ese restaurante (protegido, empleado de ese restaurante + admin)

### Admin
- GET /admin/usuarios → lista todos los usuarios del sistema (protegido, solo admin)
- GET /admin/usuarios/pendientes → lista empleados con estado 'pendiente' (protegido, solo admin)
- PATCH /admin/usuarios/:id/aprobar → aprueba un empleado pendiente → estado 'activo' (protegido, solo admin)
- PATCH /admin/usuarios/:id/rechazar → rechaza y elimina un empleado pendiente (protegido, solo admin)

## Middleware
- autenticacion_middleware.js → verifica JWT en header `Authorization: Bearer <token>`
  - Sin header o sin prefijo "Bearer " → 401 Token requerido
  - Token inválido o expirado → 401 Token inválido o expirado
  - Token válido → expone payload en `req.usuario` (id, username, rol, restaurante_id)
- roles_middleware.js → factory `verificarRol(...roles)` que retorna un middleware
  - Acepta uno o varios roles: verificarRol('admin') o verificarRol('empleado', 'admin')
  - Compara `req.usuario.rol` contra la lista → 403 Acceso denegado si no coincide
  - Siempre se encadena después de autenticacion_middleware

## Estructura de carpetas
Burger_Master/
├── middleware/
│   ├── autenticacion_middleware.js
│   └── roles_middleware.js
├── routes/
│   ├── auth.routes.js
│   ├── hamburguesas.routes.js
│   ├── restaurantes.routes.js
│   ├── votos.routes.js
│   ├── visitas.routes.js
│   └── admin.routes.js
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
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── ranking.js
│   │   ├── mapa.js
│   │   ├── visitas.js
│   │   └── modelo3d.js
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   ├── ranking.html
│   ├── mapa.html
│   ├── dashboard-empleado.html
│   └── dashboard-admin.html
├── node_modules/
├── supabase.js
├── servidor.js          ← pendiente
├── .env
├── .gitignore
├── package.json
└── PROYECTO.md
## Variables de entorno (.env)
SUPABASE_URL=
SUPABASE_ANON_KEY=
JWT_SECRET=
PORT=3000
## Diseño — secciones Landing Page
1. Hero → "Elige tu hamburguesa ganadora" | botones: Votar ahora, Ver ranking
2. Tres pasos → Explora, Vota, Sigue el resultado
3. Ubicaciones → "Encuentra los restaurantes" | mapa interactivo
4. Filtros → Proteína (res/pollo/cerdo), Sabor (picante/suave/ahumado), Ubicación
5. Ranking → votos recibidos + participantes activos en tiempo real
6. Competidores → 4 cards de hamburguesas con promedio de estrellas
7. CTA → "Haz tu voto contar" | botones: Votar, Visitar
8. Footer → Explorar, Cuenta, Acerca de, Suscribirse (decorativo)

## Navbar
Logo | Directorio  Ranking  Mapa | Ingresar  Registrarse
(Sin sección "Más")

## Paleta de colores
- Café oscuro: fondo hero y secciones de filtros
- Negro: fondo secciones intermedias
- Naranja: botones de acción principal
- Blanco: tipografía principal

## Notas importantes
- Footer es decorativo, sin funcionalidad real en esta versión
- No hay historial de votos por usuario
- No hay favoritos
- No hay email en usuarios, solo username y password
- Comunidad en footer es decorativo
- La página NO es para hacer pedidos ni domicilios
## Notas de middleware
- req.usuario → contiene id, username, rol, restaurante_id del usuario logueado
- verificarToken → nombre del middleware de autenticación
- verificarRol → nombre del middleware de roles

---

## Notas para Claude Code
> Esta sección se actualiza en cada cambio relevante para mantener contexto entre chats.

### Estado actual del proyecto (2026-04-18)
- Backend completo excepto servidor.js (pendiente, último paso)
- Frontend: estructura de archivos creada, todos vacíos listos para desarrollar

### Archivos creados — Backend
- middleware/autenticacion_middleware.js ✓
- middleware/roles_middleware.js ✓
- routes/auth.routes.js ✓
- routes/hamburguesas.routes.js ✓
- routes/restaurantes.routes.js ✓
- routes/votos.routes.js ✓
- routes/visitas.routes.js ✓
- routes/admin.routes.js ✓
- supabase.js ✓
- servidor.js ✗ pendiente

### Archivos creados — Frontend (public/)
- public/index.html ✓ vacío
- public/login.html ✓ vacío
- public/registro.html ✓ vacío
- public/ranking.html ✓ vacío
- public/mapa.html ✓ vacío
- public/dashboard-empleado.html ✓ vacío
- public/dashboard-admin.html ✓ vacío
- public/hamburguesas/hamburguesa-1.html ✓ vacío
- public/hamburguesas/hamburguesa-2.html ✓ vacío
- public/hamburguesas/hamburguesa-3.html ✓ vacío
- public/hamburguesas/hamburguesa-4.html ✓ vacío
- public/css/style.css ✓ vacío
- public/css/styles.css ✓ vacío
- public/js/app.js ✓ vacío
- public/js/auth.js ✓ vacío
- public/js/ranking.js ✓ vacío
- public/js/mapa.js ✓ vacío
- public/js/visitas.js ✓ vacío
- public/js/modelo3d.js ✓ vacío

### Decisiones de implementación
- `req.usuario` (no `req.user`) → nombre usado en todo el proyecto para el payload JWT
- `verificarRol` es factory con rest params: `verificarRol('admin', 'empleado')` soportado
- Filtro por ciudad en hamburguesas usa `ilike` (case-insensitive) sobre tabla restaurantes
- Promedio de estrellas se calcula en JS, no con RPC de Supabase
- Error 23505 en votos → responde 409 "Ya votaste por esta hamburguesa"
- Empleado solo puede ver visitas de su propio restaurante_id (validación en ruta, no solo en rol)
- password nunca se expone en ningún endpoint de respuesta
- JWT expira en 8h
- Registro: clientes → estado 'activo' inmediato; empleados → estado 'pendiente' hasta aprobación admin
- Registro: rol 'admin' bloqueado en /registrar → 403; admins se crean directo en la BD
- Login: si estado='pendiente' → 403 "Tu cuenta está pendiente de aprobación por un administrador"
- Empleados rechazados se eliminan de la BD directamente (no se guarda estado 'rechazado')