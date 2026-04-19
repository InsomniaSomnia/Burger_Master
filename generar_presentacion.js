const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";

// Colores del proyecto
const CAFE = "2C1810";
const NARANJA = "E8650A";
const BLANCO = "FFFFFF";
const NEGRO = "111111";
const GRIS = "CCCCCC";
const NARANJA_SUAVE = "F5A623";

function fondo(slide, color = CAFE) {
  slide.background = { color };
}

// ─── DIAPOSITIVA 1: Portada ───────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, CAFE);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 0.12,
    fill: { color: NARANJA }, line: { color: NARANJA },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.38, w: "100%", h: 0.12,
    fill: { color: NARANJA }, line: { color: NARANJA },
  });

  s.addText("🍔 BURGER MASTER", {
    x: 1, y: 1.2, w: 11, h: 1.5,
    fontSize: 58, bold: true, color: NARANJA, align: "center",
    fontFace: "Arial Black",
  });

  s.addText("Plataforma de Votación de Hamburguesas", {
    x: 1, y: 2.9, w: 11, h: 0.7,
    fontSize: 26, color: BLANCO, align: "center", italic: true,
  });

  s.addShape(pptx.ShapeType.rect, {
    x: 3.5, y: 3.8, w: 6, h: 0.05,
    fill: { color: NARANJA_SUAVE }, line: { color: NARANJA_SUAVE },
  });

  s.addText("Presentación técnica del equipo de desarrollo", {
    x: 1, y: 4.1, w: 11, h: 0.5,
    fontSize: 16, color: GRIS, align: "center",
  });

  s.addText("Abril 2026", {
    x: 1, y: 6.6, w: 11, h: 0.4,
    fontSize: 14, color: GRIS, align: "center",
  });
}

// ─── DIAPOSITIVA 2: ¿Qué es Burger Master? ───────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, NEGRO);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 1.1,
    fill: { color: CAFE }, line: { color: CAFE },
  });

  s.addText("¿Qué es Burger Master?", {
    x: 0.5, y: 0.15, w: 12, h: 0.8,
    fontSize: 34, bold: true, color: NARANJA,
  });

  const items = [
    { icon: "🏆", title: "Competición", desc: "4 hamburguesas compiten entre sí por el voto del público." },
    { icon: "⭐", title: "Votación con estrellas", desc: "Calificación de 1 a 5 estrellas por hamburguesa." },
    { icon: "🚫", title: "Sin pedidos", desc: "NO es una app de domicilios. Solo votación y ranking." },
    { icon: "📡", title: "Tiempo real", desc: "Ranking y visitas actualizados al instante con Supabase Realtime." },
  ];

  items.forEach((item, i) => {
    const x = i < 2 ? 0.4 : 0.4;
    const col = i % 2 === 0 ? 0.4 : 6.7;
    const row = i < 2 ? 1.5 : 4.1;

    s.addShape(pptx.ShapeType.roundRect, {
      x: col, y: row, w: 5.8, h: 2.2,
      fill: { color: "1A1A1A" }, line: { color: NARANJA, pt: 1.5 },
      rectRadius: 0.12,
    });
    s.addText(item.icon + "  " + item.title, {
      x: col + 0.2, y: row + 0.18, w: 5.4, h: 0.55,
      fontSize: 20, bold: true, color: NARANJA,
    });
    s.addText(item.desc, {
      x: col + 0.2, y: row + 0.8, w: 5.4, h: 1.2,
      fontSize: 15, color: BLANCO, wrap: true,
    });
  });
}

// ─── DIAPOSITIVA 3: Stack Tecnológico ────────────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, CAFE);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 1.1,
    fill: { color: "1A0E08" }, line: { color: "1A0E08" },
  });

  s.addText("Stack Tecnológico", {
    x: 0.5, y: 0.15, w: 12, h: 0.8,
    fontSize: 34, bold: true, color: NARANJA,
  });

  const techs = [
    { nombre: "Node.js + Express", desc: "Servidor backend y API REST", color: "3C8C3C" },
    { nombre: "Supabase", desc: "PostgreSQL · Storage · Realtime", color: "1B6B3A" },
    { nombre: "JWT + bcryptjs", desc: "Autenticación segura y hash de contraseñas", color: "7B3FAB" },
    { nombre: "HTML / CSS / JS", desc: "Frontend vanilla, sin frameworks", color: "C8880A" },
  ];

  techs.forEach((t, i) => {
    const col = i % 2 === 0 ? 0.4 : 6.7;
    const row = i < 2 ? 1.4 : 4.0;

    s.addShape(pptx.ShapeType.roundRect, {
      x: col, y: row, w: 5.8, h: 2.2,
      fill: { color: "2C1810" }, line: { color: t.color, pt: 2 },
      rectRadius: 0.12,
    });
    s.addShape(pptx.ShapeType.rect, {
      x: col, y: row, w: 0.15, h: 2.2,
      fill: { color: t.color }, line: { color: t.color },
    });
    s.addText(t.nombre, {
      x: col + 0.35, y: row + 0.25, w: 5.2, h: 0.55,
      fontSize: 20, bold: true, color: BLANCO,
    });
    s.addText(t.desc, {
      x: col + 0.35, y: row + 0.88, w: 5.2, h: 1,
      fontSize: 15, color: GRIS,
    });
  });
}

// ─── DIAPOSITIVA 4: Roles de Usuario ─────────────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, NEGRO);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 1.1,
    fill: { color: CAFE }, line: { color: CAFE },
  });
  s.addText("Roles de Usuario", {
    x: 0.5, y: 0.15, w: 12, h: 0.8,
    fontSize: 34, bold: true, color: NARANJA,
  });

  const roles = [
    {
      icon: "👤", rol: "CLIENTE", color: "2060A0",
      permisos: ["Ver y filtrar hamburguesas", "Votar con estrellas (1 vez por hamburguesa)", "Ver ranking en tiempo real", "Estado activo al registrarse"],
    },
    {
      icon: "👷", rol: "EMPLEADO", color: "3C8C3C",
      permisos: ["Registrar visitas manualmente", "Ver flujo de su propio restaurante", "Debe usar código de restaurante (1001-1004)", "Requiere aprobación del admin"],
    },
    {
      icon: "🔑", rol: "ADMIN", color: NARANJA,
      permisos: ["Ver todos los usuarios y restaurantes", "Aprobar o rechazar empleados pendientes", "Ver resumen completo de votaciones", "Se crea directo en la base de datos"],
    },
  ];

  roles.forEach((r, i) => {
    const x = 0.3 + i * 4.3;

    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 1.3, w: 4.0, h: 5.5,
      fill: { color: "161616" }, line: { color: r.color, pt: 2 },
      rectRadius: 0.15,
    });
    s.addShape(pptx.ShapeType.rect, {
      x, y: 1.3, w: 4.0, h: 0.8,
      fill: { color: r.color }, line: { color: r.color },
    });
    s.addText(r.icon + "  " + r.rol, {
      x: x + 0.15, y: 1.35, w: 3.7, h: 0.7,
      fontSize: 18, bold: true, color: BLANCO, align: "center",
    });
    r.permisos.forEach((p, j) => {
      s.addText("✔  " + p, {
        x: x + 0.2, y: 2.3 + j * 0.9, w: 3.6, h: 0.75,
        fontSize: 13, color: BLANCO, wrap: true,
      });
    });
  });
}

// ─── DIAPOSITIVA 5: Base de Datos ────────────────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, CAFE);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 1.1,
    fill: { color: "1A0E08" }, line: { color: "1A0E08" },
  });
  s.addText("Modelo de Base de Datos", {
    x: 0.5, y: 0.15, w: 12, h: 0.8,
    fontSize: 34, bold: true, color: NARANJA,
  });

  const tablas = [
    { nombre: "usuarios", campos: "id · username · password · rol · restaurante_id · estado · created_at", color: "2060A0" },
    { nombre: "restaurantes", campos: "id · nombre · direccion · ciudad · telefono · imagen_url · latitud · longitud · codigo", color: "3C8C3C" },
    { nombre: "hamburguesas", campos: "id · nombre · descripcion · imagen_url · proteina · sabor · disponible · restaurante_id", color: NARANJA },
    { nombre: "votos", campos: "id · usuario_id · hamburguesa_id · estrellas (1-5) · created_at  →  UNIQUE(usuario, hamburguesa)  ·  Realtime ON", color: "C0392B" },
    { nombre: "visitas", campos: "id · usuario_id · restaurante_id · fecha_visita  →  Realtime ON", color: "7B3FAB" },
    { nombre: "multimedia", campos: "id · hamburguesa_id · tipo (imagen/video) · url · created_at", color: "888888" },
  ];

  tablas.forEach((t, i) => {
    const col = i % 2 === 0 ? 0.3 : 6.7;
    const row = 1.3 + Math.floor(i / 2) * 2.1;

    s.addShape(pptx.ShapeType.roundRect, {
      x: col, y: row, w: 6.0, h: 1.8,
      fill: { color: "2C1810" }, line: { color: t.color, pt: 1.5 },
      rectRadius: 0.1,
    });
    s.addShape(pptx.ShapeType.rect, {
      x: col, y: row, w: 6.0, h: 0.5,
      fill: { color: t.color }, line: { color: t.color },
    });
    s.addText(t.nombre, {
      x: col + 0.15, y: row + 0.05, w: 5.7, h: 0.4,
      fontSize: 16, bold: true, color: BLANCO,
    });
    s.addText(t.campos, {
      x: col + 0.15, y: row + 0.6, w: 5.7, h: 1.0,
      fontSize: 11, color: GRIS, wrap: true,
    });
  });
}

// ─── DIAPOSITIVA 6: API REST ──────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, NEGRO);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 1.1,
    fill: { color: CAFE }, line: { color: CAFE },
  });
  s.addText("API REST — Endpoints", {
    x: 0.5, y: 0.15, w: 12, h: 0.8,
    fontSize: 34, bold: true, color: NARANJA,
  });

  const grupos = [
    {
      grupo: "Auth", color: "2060A0",
      endpoints: ["POST /registrar", "POST /login"],
    },
    {
      grupo: "Hamburguesas", color: NARANJA,
      endpoints: ["GET /hamburguesas", "GET /hamburguesas/:id", "GET /hamburguesas?proteina=...", "GET /hamburguesas?sabor=..."],
    },
    {
      grupo: "Votos", color: "C0392B",
      endpoints: ["POST /votos  🔒 cliente", "GET /votos/ranking  📡", "GET /votos/participantes"],
    },
    {
      grupo: "Admin", color: "7B3FAB",
      endpoints: ["GET /admin/usuarios  🔒", "GET /admin/usuarios/pendientes  🔒", "PATCH /admin/usuarios/:id/aprobar  🔒", "PATCH /admin/usuarios/:id/rechazar  🔒"],
    },
    {
      grupo: "Restaurantes", color: "3C8C3C",
      endpoints: ["GET /restaurantes", "GET /restaurantes/mapa"],
    },
    {
      grupo: "Visitas", color: "888888",
      endpoints: ["POST /visitas  🔒 empleado", "GET /visitas/:restaurante_id  🔒"],
    },
  ];

  grupos.forEach((g, i) => {
    const col = i % 2 === 0 ? 0.3 : 6.7;
    const row = 1.25 + Math.floor(i / 2) * 2.2;

    s.addShape(pptx.ShapeType.roundRect, {
      x: col, y: row, w: 5.9, h: 1.95,
      fill: { color: "161616" }, line: { color: g.color, pt: 1.5 },
      rectRadius: 0.1,
    });
    s.addText(g.grupo, {
      x: col + 0.2, y: row + 0.1, w: 5.5, h: 0.45,
      fontSize: 16, bold: true, color: g.color,
    });
    s.addText(g.endpoints.join("\n"), {
      x: col + 0.2, y: row + 0.6, w: 5.5, h: 1.2,
      fontSize: 11.5, color: BLANCO, fontFace: "Courier New",
    });
  });

  s.addText("🔒 = requiere JWT    📡 = Realtime", {
    x: 0.3, y: 7.1, w: 12, h: 0.3,
    fontSize: 12, color: GRIS, align: "center",
  });
}

// ─── DIAPOSITIVA 7: Frontend ──────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, CAFE);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 1.1,
    fill: { color: "1A0E08" }, line: { color: "1A0E08" },
  });
  s.addText("Frontend — Páginas y Flujo", {
    x: 0.5, y: 0.15, w: 12, h: 0.8,
    fontSize: 34, bold: true, color: NARANJA,
  });

  const paginas = [
    { archivo: "index.html", desc: "Landing page · Hero · Ranking · Filtros · Competidores", color: NARANJA },
    { archivo: "login.html", desc: "Inicio de sesión · redirige según rol JWT", color: "2060A0" },
    { archivo: "registro.html", desc: "Registro · selector de rol · código de restaurante para empleados", color: "2060A0" },
    { archivo: "ranking.html", desc: "Tabla de ranking en tiempo real · protegido con soloAutenticado()", color: "C0392B" },
    { archivo: "mapa.html", desc: "Mapa interactivo con ubicaciones de los 4 restaurantes", color: "3C8C3C" },
    { archivo: "dashboard-empleado.html", desc: "Flujo de visitas del restaurante · protegido soloRol('empleado')", color: "7B3FAB" },
    { archivo: "dashboard-admin.html", desc: "Gestión de empleados pendientes + resumen votos · soloRol('admin')", color: "888888" },
    { archivo: "hamburguesa-1..4.html", desc: "Perfil individual de cada hamburguesa · multimedia · votación", color: NARANJA },
  ];

  paginas.forEach((p, i) => {
    const col = i % 2 === 0 ? 0.3 : 6.7;
    const row = 1.25 + Math.floor(i / 2) * 1.55;

    s.addShape(pptx.ShapeType.roundRect, {
      x: col, y: row, w: 5.9, h: 1.3,
      fill: { color: "2C1810" }, line: { color: p.color, pt: 1.5 },
      rectRadius: 0.1,
    });
    s.addText(p.archivo, {
      x: col + 0.2, y: row + 0.08, w: 5.5, h: 0.42,
      fontSize: 14, bold: true, color: p.color, fontFace: "Courier New",
    });
    s.addText(p.desc, {
      x: col + 0.2, y: row + 0.55, w: 5.5, h: 0.65,
      fontSize: 12, color: BLANCO, wrap: true,
    });
  });
}

// ─── DIAPOSITIVA 8: Seguridad ─────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, NEGRO);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 1.1,
    fill: { color: CAFE }, line: { color: CAFE },
  });
  s.addText("Seguridad e Implementación", {
    x: 0.5, y: 0.15, w: 12, h: 0.8,
    fontSize: 34, bold: true, color: NARANJA,
  });

  const items = [
    { icon: "🔐", titulo: "JWT (8h expiry)", desc: "Token firmado con JWT_SECRET en .env. Middleware verifica en cada request protegido." },
    { icon: "🛡️", titulo: "bcryptjs", desc: "Contraseñas hasheadas. El campo password nunca se expone en respuestas." },
    { icon: "🚦", titulo: "Middleware de roles", desc: "verificarRol('admin') y verificarRol('empleado','admin') encadenados con verificarToken." },
    { icon: "🔒", titulo: "UNIQUE en votos", desc: "Restricción a nivel BD: UNIQUE(usuario_id, hamburguesa_id). Error 23505 → 409." },
    { icon: "⏳", titulo: "Aprobación de empleados", desc: "Empleados quedan en estado 'pendiente'. Sin aprobación admin no pueden iniciar sesión." },
    { icon: "📋", titulo: "Variables de entorno", desc: "SUPABASE_URL, SUPABASE_ANON_KEY, JWT_SECRET, PORT — nunca en el repositorio." },
  ];

  items.forEach((item, i) => {
    const col = i % 2 === 0 ? 0.3 : 6.7;
    const row = 1.25 + Math.floor(i / 2) * 2.1;

    s.addShape(pptx.ShapeType.roundRect, {
      x: col, y: row, w: 5.9, h: 1.8,
      fill: { color: "161616" }, line: { color: NARANJA, pt: 1 },
      rectRadius: 0.1,
    });
    s.addText(item.icon + "  " + item.titulo, {
      x: col + 0.2, y: row + 0.1, w: 5.5, h: 0.5,
      fontSize: 16, bold: true, color: NARANJA,
    });
    s.addText(item.desc, {
      x: col + 0.2, y: row + 0.65, w: 5.5, h: 1.0,
      fontSize: 13, color: BLANCO, wrap: true,
    });
  });
}

// ─── DIAPOSITIVA 9: Flujo de Registro/Login ───────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, CAFE);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 1.1,
    fill: { color: "1A0E08" }, line: { color: "1A0E08" },
  });
  s.addText("Flujo de Registro y Login", {
    x: 0.5, y: 0.15, w: 12, h: 0.8,
    fontSize: 34, bold: true, color: NARANJA,
  });

  // Registro
  s.addText("REGISTRO", {
    x: 0.4, y: 1.2, w: 5.8, h: 0.5,
    fontSize: 18, bold: true, color: NARANJA, align: "center",
  });

  const pasoReg = [
    "1. Usuario elige rol (cliente / empleado)",
    "2. Si empleado: ingresa código 1001-1004",
    "3. Backend valida código → busca UUID real",
    "4. Cliente → estado 'activo' inmediato",
    "5. Empleado → estado 'pendiente'",
    "6. Admin aprueba o rechaza desde su dashboard",
  ];
  pasoReg.forEach((p, i) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.4, y: 1.8 + i * 0.88, w: 5.8, h: 0.75,
      fill: { color: "2C1810" }, line: { color: NARANJA, pt: 1 },
      rectRadius: 0.08,
    });
    s.addText(p, {
      x: 0.6, y: 1.9 + i * 0.88, w: 5.4, h: 0.55,
      fontSize: 13, color: BLANCO,
    });
  });

  // Login
  s.addText("LOGIN", {
    x: 6.8, y: 1.2, w: 5.8, h: 0.5,
    fontSize: 18, bold: true, color: NARANJA, align: "center",
  });

  const pasoLog = [
    "1. POST /login con username + password",
    "2. Backend valida credenciales + estado",
    "3. Si 'pendiente' → 403 (aún no aprobado)",
    "4. Si activo → devuelve JWT firmado (8h)",
    "5. Frontend decodifica JWT → lee el rol",
    "6. Redirige: cliente→index, empleado→dash, admin→admin",
  ];
  pasoLog.forEach((p, i) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.8, y: 1.8 + i * 0.88, w: 5.8, h: 0.75,
      fill: { color: "2C1810" }, line: { color: "2060A0", pt: 1 },
      rectRadius: 0.08,
    });
    s.addText(p, {
      x: 7.0, y: 1.9 + i * 0.88, w: 5.4, h: 0.55,
      fontSize: 13, color: BLANCO,
    });
  });
}

// ─── DIAPOSITIVA 10: Realtime ─────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, NEGRO);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 1.1,
    fill: { color: CAFE }, line: { color: CAFE },
  });
  s.addText("Tiempo Real con Supabase Realtime", {
    x: 0.5, y: 0.15, w: 12, h: 0.8,
    fontSize: 34, bold: true, color: NARANJA,
  });

  s.addText("📡 ¿Cómo funciona?", {
    x: 0.5, y: 1.3, w: 12, h: 0.6,
    fontSize: 22, bold: true, color: NARANJA_SUAVE,
  });

  const pasos = [
    { n: "1", texto: "ranking.js llama GET /config para obtener las claves públicas de Supabase." },
    { n: "2", texto: "Crea un cliente Supabase desde el CDN con esas claves en el navegador." },
    { n: "3", texto: "Se suscribe a eventos INSERT en la tabla votos." },
    { n: "4", texto: "Cuando alguien vota, Supabase emite el evento en tiempo real." },
    { n: "5", texto: "El frontend recibe el evento → llama cargarRanking() + cargarParticipantes()." },
    { n: "6", texto: "La tabla del ranking se actualiza automáticamente, sin recargar la página." },
  ];

  pasos.forEach((p, i) => {
    s.addShape(pptx.ShapeType.ellipse, {
      x: 0.5, y: 2.1 + i * 0.85, w: 0.55, h: 0.55,
      fill: { color: NARANJA }, line: { color: NARANJA },
    });
    s.addText(p.n, {
      x: 0.5, y: 2.12 + i * 0.85, w: 0.55, h: 0.5,
      fontSize: 16, bold: true, color: BLANCO, align: "center",
    });
    s.addText(p.texto, {
      x: 1.3, y: 2.12 + i * 0.85, w: 11.2, h: 0.5,
      fontSize: 15, color: BLANCO,
    });
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 7.0, w: 12.3, h: 0.5,
    fill: { color: "1A0E08" }, line: { color: NARANJA, pt: 1 },
    rectRadius: 0.1,
  });
  s.addText("La tabla visitas también tiene Realtime ON — empleados y admins ven flujo en vivo.", {
    x: 0.7, y: 7.05, w: 12, h: 0.4,
    fontSize: 13, color: GRIS, italic: true,
  });
}

// ─── DIAPOSITIVA 11: Estado del Proyecto ─────────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, CAFE);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 1.1,
    fill: { color: "1A0E08" }, line: { color: "1A0E08" },
  });
  s.addText("Estado Actual del Proyecto", {
    x: 0.5, y: 0.15, w: 12, h: 0.8,
    fontSize: 34, bold: true, color: NARANJA,
  });

  const completados = [
    "Servidor Express completo (servidor.js)",
    "Todos los middlewares: auth + roles",
    "Todas las rutas backend: auth, hamburguesas, restaurantes, votos, visitas, admin",
    "Frontend completo: auth, ranking, votación, hamburguesas, admin",
    "Auth guard con redirección por rol",
    "Navbar dinámico con dropdown según rol",
    "Ranking en tiempo real (Supabase Realtime)",
    "Código de restaurante para registro de empleados",
    "Dashboard admin: aprobar/rechazar empleados",
  ];

  s.addText("✅  Completado", {
    x: 0.4, y: 1.2, w: 6, h: 0.5,
    fontSize: 18, bold: true, color: "3C8C3C",
  });

  completados.forEach((item, i) => {
    s.addText("✔  " + item, {
      x: 0.4, y: 1.75 + i * 0.6, w: 12, h: 0.55,
      fontSize: 13, color: BLANCO,
    });
  });
}

// ─── DIAPOSITIVA 12: Cierre ───────────────────────────────────────────────────
{
  const s = pptx.addSlide();
  fondo(s, NEGRO);

  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 0.12,
    fill: { color: NARANJA }, line: { color: NARANJA },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.38, w: "100%", h: 0.12,
    fill: { color: NARANJA }, line: { color: NARANJA },
  });

  s.addText("🍔", {
    x: 0, y: 1.2, w: 13.33, h: 1.5,
    fontSize: 72, align: "center",
  });

  s.addText("¡Gracias!", {
    x: 0, y: 2.9, w: 13.33, h: 1.2,
    fontSize: 60, bold: true, color: NARANJA, align: "center",
    fontFace: "Arial Black",
  });

  s.addShape(pptx.ShapeType.rect, {
    x: 3.5, y: 4.2, w: 6.33, h: 0.05,
    fill: { color: NARANJA_SUAVE }, line: { color: NARANJA_SUAVE },
  });

  s.addText("Burger Master — Plataforma de Votación de Hamburguesas", {
    x: 0.5, y: 4.5, w: 12.33, h: 0.6,
    fontSize: 18, color: GRIS, align: "center", italic: true,
  });

  s.addText("Node.js  ·  Express  ·  Supabase  ·  JWT", {
    x: 0.5, y: 5.4, w: 12.33, h: 0.5,
    fontSize: 15, color: NARANJA, align: "center",
  });

  s.addText("Equipo de Desarrollo — Abril 2026", {
    x: 0.5, y: 6.5, w: 12.33, h: 0.4,
    fontSize: 13, color: GRIS, align: "center",
  });
}

// ─── Guardar ──────────────────────────────────────────────────────────────────
pptx.writeFile({ fileName: "BurgerMaster_Presentacion.pptx" })
  .then(() => console.log("✅ BurgerMaster_Presentacion.pptx generado correctamente."))
  .catch(err => { console.error("Error:", err); process.exit(1); });
