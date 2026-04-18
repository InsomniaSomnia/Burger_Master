const HAMB_API = 'http://localhost:3000';

async function cargarHamburguesa() {
    const contenedor = document.getElementById('detalle-hamburguesa');

    try {
        const res  = await fetch(`${HAMB_API}/hamburguesas`);
        const data = await res.json();

        if (!res.ok || !data[INDICE_HAMBURGUESA]) {
            contenedor.textContent = 'Hamburguesa no encontrada';
            return;
        }

        const h = data[INDICE_HAMBURGUESA];

        document.getElementById('hamb-nombre').textContent      = h.nombre;
        document.getElementById('hamb-descripcion').textContent = h.descripcion || '—';
        document.getElementById('hamb-restaurante').textContent = h.restaurantes?.nombre || '—';
        document.getElementById('hamb-proteina').textContent    = h.proteina || '—';
        document.getElementById('hamb-sabor').textContent       = h.sabor || '—';

        const contenedorEstrellas = document.getElementById('estrellas-voto');
        const msgVoto             = document.getElementById('msg-voto');

        contenedorEstrellas.innerHTML = [1, 2, 3, 4, 5].map(n =>
            `<span class="estrella-voto" data-valor="${n}" data-id="${h.id}" style="cursor:pointer;font-size:2rem;">★</span>`
        ).join('');

        contenedorEstrellas.addEventListener('click', async (e) => {
            const estrella = e.target.closest('.estrella-voto');
            if (!estrella) return;

            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login.html'; return; }

            const hamburguesa_id = estrella.dataset.id;
            const estrellas      = parseInt(estrella.dataset.valor);

            try {
                const votoRes = await fetch(`${HAMB_API}/votos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ hamburguesa_id, estrellas })
                });

                const result = await votoRes.json();

                if (votoRes.status === 409) {
                    msgVoto.textContent = 'Ya votaste por esta hamburguesa';
                    deshabilitarEstrellas(contenedorEstrellas);
                } else if (votoRes.ok) {
                    msgVoto.textContent = 'Voto registrado exitosamente';
                    deshabilitarEstrellas(contenedorEstrellas);
                } else {
                    msgVoto.textContent = result.error || 'Error al votar';
                }
            } catch {
                msgVoto.textContent = 'No se pudo conectar al servidor';
            }
        });

    } catch {
        contenedor.textContent = 'No se pudo conectar al servidor';
    }
}

function deshabilitarEstrellas(contenedor) {
    contenedor.querySelectorAll('.estrella-voto').forEach(s => {
        s.style.cursor        = 'not-allowed';
        s.style.pointerEvents = 'none';
        s.style.opacity       = '0.4';
    });
}

cargarHamburguesa();
