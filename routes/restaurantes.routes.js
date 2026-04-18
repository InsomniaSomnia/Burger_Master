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

// GET /restaurantes/mapa — debe ir antes de /:id para que Express no lo capture como id='mapa'
router.get('/mapa', async (req, res) => {
  const { data, error } = await supabase
    .from('restaurantes')
    .select('id, nombre, latitud, longitud');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// GET /restaurantes/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('restaurantes')
    .select('id, nombre, direccion, ciudad, telefono, imagen_url, latitud, longitud')
    .eq('id', req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Restaurante no encontrado' });

  res.json(data);
});

module.exports = router;
