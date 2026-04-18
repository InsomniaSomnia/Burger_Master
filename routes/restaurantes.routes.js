const express = require('express');
const supabase = require('../supabase');

const router = express.Router();

// GET /restaurantes
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('restaurantes')
    .select('id, nombre, direccion, ciudad, telefono, imagen_url, latitud, longitud');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// GET /restaurantes/mapa
router.get('/mapa', async (req, res) => {
  const { data, error } = await supabase
    .from('restaurantes')
    .select('id, nombre, latitud, longitud');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

module.exports = router;
