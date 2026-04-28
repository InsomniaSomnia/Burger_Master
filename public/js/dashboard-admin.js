async function cargarRanking() {
    const contenedor = document.getElementById('lista-ranking');
    try {
        const res  = await fetch(`${API_URL}/votos/ranking`);
        const data = await res.json();

        if (!res.ok) { contenedor.textContent = 'Error al cargar el ranking.'; return; }
        if (!data.length) { contenedor.textContent = 'Sin votos registrados aún.'; return; }

        contenedor.innerHTML = '<table><thead><tr><th>Hamburguesa</th><th>Promedio estrellas</th><th>Total votos</th></tr></thead><tbody>' +
            data.map(h =>
                `<tr><td>${h.nombre}</td><td>${Number(h.promedio_estrellas).toFixed(2)}</td><td>${h.total_votos}</td></tr>`
            ).join('') +
            '</tbody></table>';
    } catch {
        contenedor.textContent = 'No se pudo conectar al servidor.';
    }
}

async function cargarPendientes() {
    const contenedor = document.getElementById('lista-pendientes');
    const token = localStorage.getItem('token');
    try {
        const res  = await fetch(`${API_URL}/admin/usuarios/pendientes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (!res.ok) { contenedor.textContent = 'Error al cargar pendientes.'; return; }
        if (!data.length) { contenedor.textContent = 'No hay solicitudes pendientes.'; return; }

        contenedor.innerHTML = '<ul>' +
            data.map(emp => `
                <li>
                    <strong>${emp.username}</strong> — Restaurante ID: ${emp.restaurante_id}
                    <button onclick="aprobar('${emp.id}')">Aprobar</button>
                    <button onclick="rechazar('${emp.id}')">Rechazar</button>
                </li>
            `).join('') +
            '</ul>';
    } catch {
        contenedor.textContent = 'No se pudo conectar al servidor.';
    }
}

async function aprobar(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/admin/usuarios/${id}/aprobar`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Error al aprobar el empleado.');
        return;
    }
    cargarPendientes();
}

async function rechazar(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/admin/usuarios/${id}/rechazar`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Error al rechazar el empleado.');
        return;
    }
    cargarPendientes();
}

cargarRanking();
cargarPendientes();
