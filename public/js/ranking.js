function countUp(el, destino, duracion = 1800) {
    const inicio = performance.now();
    const tick = (ahora) => {
        const p    = Math.min((ahora - inicio) / duracion, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * destino);
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

function estrellasHTML(promedio, color) {
    const llenas = Math.round(promedio);
    return `<span style="color:${color};letter-spacing:4px;font-size:1.1rem;">${'★'.repeat(llenas)}</span>` +
           `<span style="color:rgba(255,255,255,0.1);letter-spacing:4px;font-size:1.1rem;">${'★'.repeat(5 - llenas)}</span>`;
}

function renderLider(h) {
    const contenedor = document.getElementById('lider-contenido');
    contenedor.innerHTML = `
        <span class="lider-badge">&#9670; Líder</span>
        <h2 class="lider-nombre">${h.nombre}</h2>
        <div class="lider-sep"></div>
        <span class="lider-restaurante">${h.restaurante || 'Burger Master'}</span>
        <div class="lider-estrellas">${'★'.repeat(Math.round(h.promedio_estrellas))}${'☆'.repeat(5 - Math.round(h.promedio_estrellas))}</div>
        <div class="lider-stats">
            <span class="lider-promedio">${h.promedio_estrellas.toFixed(1)}</span>
            <div class="lider-votos">
                <div style="font-size:1.1rem;font-weight:700;color:var(--texto);">${h.total_votos}</div>
                <div>votos totales</div>
            </div>
        </div>
        <a href="/hamburguesas/hamburguesa-${h.id}.html" class="btn-lider">Ver detalle &rarr;</a>
    `;
}

function renderClasificacion(lista) {
    const contenedor = document.getElementById('lista-clasificacion');

    contenedor.innerHTML = lista.map((h, i) => {
        const pos = i + 2;
        const pct = ((h.promedio_estrellas / 5) * 100).toFixed(1);
        return `
            <div class="fila-clasificacion" data-pct="${pct}">
                <span class="fila-pos-watermark">${pos}</span>
                <div class="fila-info">
                    <span class="fila-nombre">${h.nombre}</span>
                    <span class="fila-restaurante">${h.restaurante || '—'}</span>
                    <div class="fila-barra-wrap">
                        <div class="fila-barra-fill"></div>
                    </div>
                </div>
                <div class="fila-derecha">
                    <div class="fila-stat">
                        <span class="fila-stat-num">${h.promedio_estrellas.toFixed(1)}</span>
                        <span class="fila-stat-label">promedio</span>
                    </div>
                    <div class="fila-divider-v"></div>
                    <div class="fila-stat">
                        <span class="fila-stat-num">${h.total_votos}</span>
                        <span class="fila-stat-label">votos</span>
                    </div>
                </div>
            </div>`;
    }).join('');

    setTimeout(() => {
        contenedor.querySelectorAll('.fila-clasificacion').forEach(fila => {
            const pct  = fila.dataset.pct;
            const fill = fila.querySelector('.fila-barra-fill');
            if (fill) fill.style.width = pct + '%';
        });
    }, 100);
}

function renderCards(ranking) {
    const grid = document.getElementById('grid-cards');
    const labels = ['Líder', '2° Lugar', '3° Lugar', '4° Lugar'];

    grid.innerHTML = ranking.map((h, i) => `
        <article class="comp-card">
            <span class="card-pos-wm">${i + 1}</span>
            <span class="card-pos-label">${labels[i]}</span>
            <span class="card-nombre">${h.nombre}</span>
            <span class="card-estrellas">${'★'.repeat(Math.round(h.promedio_estrellas))}${'☆'.repeat(5 - Math.round(h.promedio_estrellas))}</span>
            <div class="card-sep"></div>
            <span class="card-meta">${h.promedio_estrellas.toFixed(1)} · ${h.total_votos} votos</span>
            <a href="/hamburguesas/hamburguesa-${h.id}.html" class="btn-card">Ver detalle &rarr;</a>
        </article>
    `).join('');
}

async function cargarRanking() {
    try {
        const res  = await fetch('/votos/ranking');
        const data = await res.json();
        if (!res.ok || !data.length) return;

        renderLider(data[0]);
        renderClasificacion(data.slice(1));
        renderCards(data);
    } catch (_) {}
}

async function cargarParticipantes() {
    try {
        const res  = await fetch('/votos/participantes');
        const data = await res.json();
        if (res.ok) {
            const el = document.getElementById('num-participantes');
            countUp(el, data.participantes);
        }
    } catch (_) {}
}

cargarRanking();
cargarParticipantes();
setInterval(() => { cargarRanking(); cargarParticipantes(); }, 15000);
