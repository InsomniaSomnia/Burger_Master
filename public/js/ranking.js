const RANKING_API = 'http://localhost:3000';

function iniciales(nombre) {
    return nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function renderizarTabla(ranking) {
    const tbody = document.getElementById('tbody-ranking');
    tbody.innerHTML = ranking.map((h, i) => {
        const img = h.imagen_url
            ? `<img src="${h.imagen_url}" alt="${h.nombre}" width="60">`
            : `<span>${iniciales(h.nombre)}</span>`;

        return `<tr>
            <td>${i + 1}</td>
            <td>${img}</td>
            <td>${h.nombre}</td>
            <td>${h.restaurante}</td>
            <td>${h.promedio_estrellas.toFixed(1)} ★</td>
            <td>${h.total_votos}</td>
        </tr>`;
    }).join('');
}

async function cargarRanking() {
    try {
        const res  = await fetch(`${RANKING_API}/votos/ranking`);
        const data = await res.json();
        if (res.ok) renderizarTabla(data);
    } catch {}
}

async function cargarParticipantes() {
    try {
        const res  = await fetch(`${RANKING_API}/votos/participantes`);
        const data = await res.json();
        if (res.ok) {
            document.getElementById('total-participantes').textContent =
                `Participantes activos: ${data.participantes}`;
        }
    } catch {}
}

async function iniciarRealtime() {
    try {
        const res    = await fetch(`${RANKING_API}/config`);
        const config = await res.json();

        const supabaseClient = supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);

        supabaseClient
            .channel('votos-ranking')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votos' }, () => {
                cargarRanking();
                cargarParticipantes();
            })
            .subscribe();
    } catch {}
}

cargarRanking();
cargarParticipantes();
iniciarRealtime();
