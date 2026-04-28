// ── Constante de identificación ────────────────────────────────────────────
const HAMBURGUESA_ID = 1;

// ── Modelo 3D ───────────────────────────────────────────────────────────────
const visor3d = document.getElementById('visor-3d');
const overlay = document.getElementById('loading-overlay');

visor3d.addEventListener('load', () => {
    overlay.classList.add('oculto');
});

visor3d.addEventListener('error', () => {
    overlay.innerHTML = '<span style="color:#f87171;text-align:center;padding:1rem;font-size:0.8rem;">No se pudo cargar el modelo 3D.</span>';
});

// ── Stats ───────────────────────────────────────────────────────────────────
async function cargarStats() {
    try {
        const [resRanking, resParticipantes] = await Promise.all([
            fetch('/votos/ranking'),
            fetch('/votos/participantes'),
        ]);

        if (resRanking.ok) {
            const ranking = await resRanking.json();
            const entry = ranking.find(h => h.id === HAMBURGUESA_ID);
            if (entry) {
                document.getElementById('stat-promedio').textContent =
                    entry.promedio_estrellas > 0
                        ? entry.promedio_estrellas.toFixed(1)
                        : '—';
                document.getElementById('stat-votos').textContent = entry.total_votos;
            }
        }

        if (resParticipantes.ok) {
            const data = await resParticipantes.json();
            document.getElementById('stat-participantes').textContent = data.participantes;
        }

    } catch {
        // Si falla la conexión, mostrar guiones
        document.getElementById('stat-promedio').textContent = '—';
        document.getElementById('stat-votos').textContent    = '—';
        document.getElementById('stat-participantes').textContent = '—';
    }
}

// Llamar al cargar la página
cargarStats();

// ── Votación ────────────────────────────────────────────────────────────────
const btnVotar  = document.getElementById('btn-votar');
const msgVoto   = document.getElementById('mensaje-voto');
const estrellas = document.querySelectorAll('.estrella');
let estrellaSeleccionada = 0;

function setMensajeVoto(texto, tipo) {
    msgVoto.textContent = texto;
    msgVoto.className   = tipo || '';
}

function resaltarEstrellas(n) {
    estrellas.forEach(e => {
        e.classList.toggle('activa', parseInt(e.dataset.valor) <= n);
    });
}

// decodificarToken() viene de /js/app.js
const usuario = decodificarToken();

if (!usuario) {
    // Usuario no autenticado: el botón redirige al login
    btnVotar.textContent = 'Inicia sesión para votar';
    btnVotar.disabled    = false;
    btnVotar.addEventListener('click', () => {
        window.location.href = '/login.html';
    });

} else if (usuario.rol !== 'cliente') {
    // Usuarios que no son clientes no pueden votar
    btnVotar.textContent = 'Solo clientes pueden votar';

} else {
    // Usuario autenticado como cliente: habilitar estrellas
    estrellas.forEach(estrella => {
        estrella.addEventListener('mouseover', () => {
            resaltarEstrellas(parseInt(estrella.dataset.valor));
        });

        estrella.addEventListener('mouseout', () => {
            resaltarEstrellas(estrellaSeleccionada);
        });

        estrella.addEventListener('click', () => {
            estrellaSeleccionada  = parseInt(estrella.dataset.valor);
            resaltarEstrellas(estrellaSeleccionada);
            btnVotar.disabled     = false;
            btnVotar.textContent  = `Votar con ${estrellaSeleccionada} ★`;
        });
    });

    btnVotar.addEventListener('click', async () => {
        if (estrellaSeleccionada === 0) return;

        const token         = localStorage.getItem('token');
        btnVotar.disabled   = true;
        btnVotar.textContent = 'Enviando…';

        try {
            const res = await fetch('/votos', {
                method: 'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    hamburguesa_id: HAMBURGUESA_ID,
                    estrellas: estrellaSeleccionada,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMensajeVoto('¡Voto registrado! Gracias por participar.', 'exito');
                btnVotar.textContent = 'Voto registrado ✓';
                // Deshabilitar estrellas para no votar dos veces
                estrellas.forEach(e => e.style.pointerEvents = 'none');
                cargarStats();

            } else if (res.status === 409) {
                setMensajeVoto('Ya votaste por esta hamburguesa.', 'error');
                btnVotar.textContent = 'Ya votaste';

            } else {
                setMensajeVoto(data.error || 'Error al registrar el voto.', 'error');
                btnVotar.disabled    = false;
                btnVotar.textContent = `Votar con ${estrellaSeleccionada} ★`;
            }

        } catch {
            setMensajeVoto('No se pudo conectar al servidor.', 'error');
            btnVotar.disabled    = false;
            btnVotar.textContent = `Votar con ${estrellaSeleccionada} ★`;
        }
    });
}