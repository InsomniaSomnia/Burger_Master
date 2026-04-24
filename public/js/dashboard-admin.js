const ADMIN_API = 'http://localhost:3000/admin';
let adminActual = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Validar que el usuario actual es un Administrador
    if (typeof soloRol === 'function') {
        adminActual = soloRol('admin');
        if (!adminActual) return;
    } else {
        console.error('auth-guard.js debe cargarse antes que dashboard-admin.js');
        return;
    }

    // 2. Cargar la lista inicial de usuarios pendientes
    cargarUsuariosPendientes();
    
    // 3. Cargar la lista de TODOS los usuarios (Visión global del Admin)
    cargarTodosLosUsuarios();
});

async function cargarUsuariosPendientes() {
    const tbody = document.getElementById('tbody-pendientes');
    if (!tbody) return;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${ADMIN_API}/usuarios/pendientes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No hay usuarios pendientes de aprobación</td></tr>`;
                return;
            }

            tbody.innerHTML = data.map(u => `
                <tr>
                    <td>${u.username}</td>
                    <td>Empleado</td>
                    <td>ID: ${u.restaurante_id || 'N/A'}</td>
                    <td>
                        <button onclick="cambiarEstadoUsuario('${u.id}', 'aprobar')" class="btn-aprobar" style="background:#22c55e;color:white;padding:5px 10px;border:none;border-radius:4px;cursor:pointer;">Aprobar</button>
                        <button onclick="cambiarEstadoUsuario('${u.id}', 'rechazar')" class="btn-rechazar" style="background:#ef4444;color:white;padding:5px 10px;border:none;border-radius:4px;cursor:pointer;margin-left:5px;">Rechazar</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="4">Error al cargar usuarios pendientes.</td></tr>`;
        }
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4">Error de conexión con el servidor.</td></tr>`;
    }
}

async function cambiarEstadoUsuario(id, accion) {
    const confirmar = confirm(`¿Estás seguro de que deseas ${accion} a este usuario?`);
    if (!confirmar) return;

    const token = localStorage.getItem('token');

    try {
        // Envía la petición a /admin/usuarios/:id/aprobar o /admin/usuarios/:id/rechazar
        const response = await fetch(`${ADMIN_API}/usuarios/${id}/${accion}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert(`Usuario ${accion === 'aprobar' ? 'aprobado' : 'rechazado'} con éxito.`);
            cargarUsuariosPendientes(); // Recargamos la tabla automáticamente
        } else {
            const data = await response.json();
            alert('Error: ' + (data.error || `No se pudo ${accion} al usuario.`));
        }
    } catch (error) {
        alert('Error de conexión con el servidor.');
    }
}

async function cargarTodosLosUsuarios() {
    const tbody = document.getElementById('tbody-todos-usuarios');
    if (!tbody) return; // Si no existe la tabla en el HTML, no hace nada

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${ADMIN_API}/usuarios`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            tbody.innerHTML = data.map(u => `
                <tr>
                    <td>${u.username}</td>
                    <td style="text-transform: capitalize;">${u.rol}</td>
                    <td>${u.estado === 'activo' ? '🟢 Activo' : u.estado === 'pendiente' ? '🟠 Pendiente' : u.estado}</td>
                    <td>${new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="4">Error al cargar usuarios.</td></tr>`;
        }
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4">Error de conexión.</td></tr>`;
    }
}