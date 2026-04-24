const VISITAS_API = 'http://localhost:3000';
let usuarioActual = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Proteger la ruta usando la función de auth-guard.js
    if (typeof soloRol === 'function') {
        usuarioActual = soloRol('empleado');
        if (!usuarioActual) return; // Si no es empleado, auth-guard lo redirige
    } else {
        console.error('El archivo auth-guard.js debe cargarse antes que dashboard-empleado.js');
        return;
    }

    // 2. Escuchar el envío del formulario de registro de visita
    const formVisita = document.getElementById('formulario-visita');
    if (formVisita) {
        formVisita.addEventListener('submit', registrarVisita);
    }

    // 3. Cargar las visitas iniciales
    cargarHistorialVisitas();
});

async function registrarVisita(e) {
    e.preventDefault();
    
    const fechaInput = document.getElementById('fecha-visita'); // Opcional
    const mensaje = document.getElementById('mensaje-visita');
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${VISITAS_API}/visitas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                // Si no se envía fecha, el backend usa la fecha actual automáticamente
                fecha_visita: fechaInput && fechaInput.value ? fechaInput.value : undefined
            })
        });

        const data = await response.json();

        if (response.ok) {
            if (mensaje) {
                mensaje.textContent = '✅ Visita registrada con éxito.';
                mensaje.className = 'mensaje-feedback exito';
            }
            cargarHistorialVisitas(); // Recargar la tabla automáticamente
        } else {
            if (mensaje) {
                mensaje.textContent = '❌ ' + (data.error || 'Error al registrar visita.');
                mensaje.className = 'mensaje-feedback error';
            }
        }
    } catch (error) {
        if (mensaje) {
            mensaje.textContent = '❌ Error de conexión con el servidor.';
            mensaje.className = 'mensaje-feedback error';
        }
    }
}

async function cargarHistorialVisitas() {
    const tbody = document.getElementById('tbody-visitas');
    if (!tbody) return;

    const token = localStorage.getItem('token');
    if (!usuarioActual || !usuarioActual.restaurante_id) return;

    try {
        const response = await fetch(`${VISITAS_API}/visitas/${usuarioActual.restaurante_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            tbody.innerHTML = data.map((visita, index) => {
                const fecha = new Date(visita.fecha_visita).toLocaleString();
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${fecha}</td>
                    </tr>
                `;
            }).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="2">Error al cargar historial</td></tr>`;
        }
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="2">Error de conexión</td></tr>`;
    }
}