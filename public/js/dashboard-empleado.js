const usuarioEmpleado = decodificarToken();

async function registrarVisita() {
    const mensaje = document.getElementById('mensaje-visita');
    const token   = localStorage.getItem('token');

    try {
        const res  = await fetch('/visitas', {
            method: 'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });
        const data = await res.json();

        if (res.ok) {
            mensaje.textContent = 'Visita registrada con éxito.';
            mensaje.style.color = '#22c55e';
            cargarVisitas();
        } else {
            mensaje.textContent = data.error || 'Error al registrar visita.';
            mensaje.style.color = '#ef4444';
        }
    } catch {
        mensaje.textContent = 'No se pudo conectar al servidor.';
        mensaje.style.color = '#ef4444';
    }
}

async function cargarVisitas() {
    const contenedor = document.getElementById('lista-visitas');
    const token      = localStorage.getItem('token');

    if (!usuarioEmpleado || !usuarioEmpleado.restaurante_id) {
        contenedor.textContent = 'No se encontró tu restaurante asignado.';
        return;
    }

    try {
        const res  = await fetch(`/visitas/${usuarioEmpleado.restaurante_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (!res.ok) { contenedor.textContent = 'Error al cargar visitas.'; return; }
        if (!data.length) { contenedor.textContent = 'Sin visitas registradas aún.'; return; }

        contenedor.innerHTML = data.map(v => {
            const fecha = new Date(v.fecha_visita).toLocaleString('es-CO');
            return `<div class="visita-item"><span>${fecha}</span></div>`;
        }).join('');
    } catch {
        contenedor.textContent = 'No se pudo conectar al servidor.';
    }
}

document.getElementById('btn-registrar-visita').addEventListener('click', registrarVisita);

cargarVisitas();
