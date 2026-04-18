function obtenerUsuario() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

function soloAutenticado() {
    const usuario = obtenerUsuario();
    if (!usuario) window.location.href = '/login.html';
    return usuario;
}

function soloRol(...rolesPermitidos) {
    const usuario = obtenerUsuario();
    if (!usuario) { window.location.href = '/login.html'; return null; }
    if (!rolesPermitidos.includes(usuario.rol)) { window.location.href = '/index.html'; return null; }
    return usuario;
}
