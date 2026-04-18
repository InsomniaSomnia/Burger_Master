const express = require('express');
const supabase = require('../supabase');
const verificarToken = require('../middleware/autenticacion_middleware');
const verificarRol = require('../middleware/roles_middleware');

const router = express.Router();

// POST /votos — solo clientes autenticados
router.post('/', verificarToken, verificarRol('cliente'), async (req, res) => {
  const { hamburguesa_id, estrellas } = req.body;
  const usuario_id = req.usuario.id;

  if (!hamburguesa_id || !estrellas) {
    return res.status(400).json({ error: 'hamburguesa_id y estrellas son requeridos' });
  }

  if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
    return res.status(400).json({ error: 'estrellas debe ser un entero entre 1 y 5' });
  }

  const { data, error } = await supabase
    .from('votos')
    .insert({ usuario_id, hamburguesa_id, estrellas })
    .select('id, usuario_id, hamburguesa_id, estrellas, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya votaste por esta hamburguesa' });
    }
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ voto: data });
});

// GET /votos/ranking
router.get('/ranking', async (req, res) => {
  const { data, error } = await supabase
    .from('hamburguesas')
    .select('id, nombre, imagen_url, restaurantes(nombre), votos(estrellas)');

  if (error) return res.status(500).json({ error: error.message });

  const ranking = data
    .map((h) => {
      const total = h.votos.length;
      const promedio =
        total > 0
          ? Math.round((h.votos.reduce((acc, v) => acc + v.estrellas, 0) / total) * 10) / 10
          : 0;
      return {
        id: h.id,
        nombre: h.nombre,
        imagen_url: h.imagen_url,
        restaurante: h.restaurantes?.nombre || '—',
        promedio_estrellas: promedio,
        total_votos: total,
      };
    })
    .sort((a, b) => b.promedio_estrellas - a.promedio_estrellas || b.total_votos - a.total_votos);

  res.json(ranking);
});

// GET /votos/participantes
router.get('/participantes', async (req, res) => {
  const { data, error } = await supabase
    .from('votos')
    .select('usuario_id');

  if (error) return res.status(500).json({ error: error.message });

  const distintos = new Set(data.map((v) => v.usuario_id)).size;

  res.json({ participantes: distintos });
});

module.exports = router;
