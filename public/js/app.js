const API_URL = 'http://localhost:3000';

// ── JWT helper ────────────────────────────────────────────────────────────────
function decodificarToken() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        return JSON.parse(atob(token.split('.')[1]));
    } catch { return null; }
}

// ── Navbar (todas las páginas) ────────────────────────────────────────────────
const navInvitado = document.getElementById('nav-invitado');
const navUsuario  = document.getElementById('nav-usuario');

if (navInvitado && navUsuario) {
    (async () => {
        const usuario = decodificarToken();

        if (usuario) {
            navInvitado.style.display = 'none';
            navUsuario.style.display  = 'flex';
            document.getElementById('nav-username').textContent = usuario.username;

            const btnFoto  = document.getElementById('btn-perfil-foto');
            const dropdown = document.getElementById('dropdown-perfil');

            let itemsHTML = '<a href="#">Perfil</a>';

            if (usuario.rol === 'empleado') {
                let nombreRestaurante = 'Mi Dashboard';
                if (usuario.restaurante_id) {
                    try {
                        const res = await fetch(`${API_URL}/restaurantes/${usuario.restaurante_id}`);
                        const rest = await res.json();
                        if (res.ok && rest.nombre) nombreRestaurante = rest.nombre;
                    } catch {}
                }
                itemsHTML += `<a href="/dashboard-empleado.html">${nombreRestaurante}</a>`;
            } else if (usuario.rol === 'admin') {
                itemsHTML += '<a href="/dashboard-admin.html">Panel Admin</a>';
            }

            itemsHTML += '<a href="#">Configuración</a>';
            itemsHTML += '<button id="btn-cerrar-sesion" type="button">Cerrar sesión</button>';
            dropdown.innerHTML = itemsHTML;

            btnFoto.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            });

            document.addEventListener('click', () => {
                dropdown.style.display = 'none';
            });

            document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
                localStorage.removeItem('token');
                window.location.href = '/index.html';
            });
        } else {
            navInvitado.style.display = 'flex';
            navUsuario.style.display  = 'none';
        }
    })();
}

// ── Registro (solo en registro.html) ─────────────────────────────────────────
const formularioRegistro = document.getElementById('formulario-registro');

if (formularioRegistro) {
    const inputPassword     = document.getElementById('password');
    const inputConfirmar    = document.getElementById('confirmar-password');
    const barraSeguridad    = document.getElementById('nivelseguridad');
    const errorConfirmacion = document.getElementById('error-confirmacion');
    const mensajeRegistro   = document.getElementById('mensaje-registro');
    const checkVerPass      = document.getElementById('ver-contrasena');
    const checkVerConfirm   = document.getElementById('mostrar-confirmacion');
    const selectRol         = document.getElementById('rol');
    const campoRestaurante  = document.getElementById('campo-restaurante');
    const inputRestaurante  = document.getElementById('restaurante_id');
    const errorRestaurante  = document.getElementById('error-restaurante');

    selectRol.addEventListener('change', () => {
        if (selectRol.value === 'empleado') {
            campoRestaurante.style.display = 'block';
            inputRestaurante.required = true;
        } else {
            campoRestaurante.style.display = 'none';
            inputRestaurante.required = false;
            inputRestaurante.value = '';
            errorRestaurante.style.display = 'none';
        }
    });

    inputPassword.addEventListener('input', () => {
        const valor = inputPassword.value;
        let fortaleza = 0;

        if (valor.length >= 5)    fortaleza += 30;
        if (valor.match(/[A-Z]/)) fortaleza += 30;
        if (valor.match(/[0-9]/)) fortaleza += 40;

        barraSeguridad.style.width = fortaleza + '%';

        if (fortaleza <= 40)      barraSeguridad.style.background = '#ef4444';
        else if (fortaleza <= 70) barraSeguridad.style.background = '#f59e0b';
        else                      barraSeguridad.style.background = '#22c55e';

        if (inputConfirmar.value !== '') validarCoincidencia();
    });

    function validarCoincidencia() {
        if (inputConfirmar.value === '') {
            errorConfirmacion.style.display = 'none';
            inputConfirmar.style.borderColor = 'transparent';
            return true;
        }
        if (inputPassword.value !== inputConfirmar.value) {
            errorConfirmacion.style.display = 'block';
            inputConfirmar.style.borderColor = '#E53E3E';
            return false;
        } else {
            errorConfirmacion.style.display = 'none';
            inputConfirmar.style.borderColor = '#38A169';
            return true;
        }
    }

    inputConfirmar.addEventListener('input', validarCoincidencia);

    checkVerPass.addEventListener('change', () => {
        inputPassword.type = checkVerPass.checked ? 'text' : 'password';
    });

    checkVerConfirm.addEventListener('change', () => {
        inputConfirmar.type = checkVerConfirm.checked ? 'text' : 'password';
    });

    formularioRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validarCoincidencia()) {
            setMensaje(mensajeRegistro, 'Las contraseñas no coinciden.', 'error');
            return;
        }

        const rol = selectRol.value;

        if (rol === 'empleado' && !inputRestaurante.value.trim()) {
            errorRestaurante.style.display = 'block';
            setMensaje(mensajeRegistro, 'El ID del restaurante es requerido para empleados.', 'error');
            return;
        }
        errorRestaurante.style.display = 'none';

        const username       = document.getElementById('username').value.trim();
        const password       = inputPassword.value;
        const restaurante_id = rol === 'empleado' ? parseInt(inputRestaurante.value) : null;

        try {
            const response = await fetch(`${API_URL}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, rol, restaurante_id })
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = '/login.html';
            } else {
                setMensaje(mensajeRegistro, data.error || 'Error al registrar.', 'error');
            }
        } catch {
            setMensaje(mensajeRegistro, 'No se pudo conectar al servidor.', 'error');
        }
    });
}

// ── Login (solo en login.html) ────────────────────────────────────────────────
const formularioLogin = document.getElementById('formulario-login');

if (formularioLogin) {
    const mensajeLogin    = document.getElementById('mensaje-login');
    const checkVerLogin   = document.getElementById('mostrar-login');
    const loginPasswordEl = document.getElementById('login-password');

    checkVerLogin.addEventListener('change', () => {
        loginPasswordEl.type = checkVerLogin.checked ? 'text' : 'password';
    });

    formularioLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = loginPasswordEl.value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setMensaje(mensajeLogin, '¡Bienvenido! Redirigiendo...', 'exito');
                setTimeout(() => { window.location.href = '/index.html'; }, 800);
            } else {
                setMensaje(mensajeLogin, data.error || 'Credenciales incorrectas.', 'error');
            }
        } catch {
            setMensaje(mensajeLogin, 'No se pudo conectar al servidor.', 'error');
        }
    });
}

// ── Login Admin (solo en login-admin.html) ────────────────────────────────────
const formularioLoginAdmin = document.getElementById('formulario-login-admin');

if (formularioLoginAdmin) {
    const mensajeAdmin    = document.getElementById('mensaje-login-admin');
    const checkVerAdmin   = document.getElementById('mostrar-login-admin');
    const adminPasswordEl = document.getElementById('admin-password');

    checkVerAdmin.addEventListener('change', () => {
        adminPasswordEl.type = checkVerAdmin.checked ? 'text' : 'password';
    });

    formularioLoginAdmin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('admin-username').value.trim();
        const password = adminPasswordEl.value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                if (payload.rol !== 'admin') {
                    setMensaje(mensajeAdmin, 'No tienes permisos de administrador.', 'error');
                    return;
                }
                localStorage.setItem('token', data.token);
                setMensaje(mensajeAdmin, 'Acceso concedido. Redirigiendo...', 'exito');
                setTimeout(() => { window.location.href = '/dashboard-admin.html'; }, 800);
            } else {
                setMensaje(mensajeAdmin, data.error || 'Credenciales incorrectas.', 'error');
            }
        } catch {
            setMensaje(mensajeAdmin, 'No se pudo conectar al servidor.', 'error');
        }
    });
}

// ── Botón Votar ahora (solo en index.html) ────────────────────────────────────
const btnVotarAhora = document.getElementById('btn-votar-ahora');

if (btnVotarAhora) {
    btnVotarAhora.addEventListener('click', (e) => {
        e.preventDefault();
        const usuario = decodificarToken();
        if (usuario && usuario.rol === 'cliente') {
            window.location.href = '/hamburguesas/hamburguesa-1.html';
        } else {
            window.location.href = '/login.html';
        }
    });
}

// ── Utilidad ──────────────────────────────────────────────────────────────────
function setMensaje(el, texto, tipo) {
    el.textContent = texto;
    el.className   = 'mensaje-feedback ' + (tipo || '');
}
