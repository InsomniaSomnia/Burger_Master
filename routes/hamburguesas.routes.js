const express = require('express');
const supabase = require('../supabase');

const router = express.Router();

function calcularPromedio(votos) {
  if (!votos || votos.length === 0) return 0;
  const suma = votos.reduce((acc, v) => acc + v.estrellas, 0);
  return Math.round((suma / votos.length) * 10) / 10;
}

// GET /hamburguesas?proteina=&sabor=&ciudad=
router.get('/', async (req, res) => {
  const { proteina, sabor, ciudad } = req.query;

  let restauranteIds = null;

  if (ciudad) {
    const { data: restaurantes, error: errRest } = await supabase
      .from('restaurantes')
      .select('id')
      .ilike('ciudad', ciudad);

    if (errRest) return res.status(500).json({ error: errRest.message });

    restauranteIds = restaurantes.map((r) => r.id);
    if (restauranteIds.length === 0) return res.json([]);
  }

  let query = supabase
    .from('hamburguesas')
    .select('id, nombre, descripcion, imagen_url, qr_url, proteina, sabor, disponible, restaurante_id, restaurantes(nombre, ciudad), votos(estrellas)')
    .eq('disponible', true);

  if (proteina) query = query.eq('proteina', proteina);
  if (sabor) query = query.eq('sabor', sabor);
  if (restauranteIds) query = query.in('restaurante_id', restauranteIds);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  const resultado = data.map(({ votos, ...h }) => ({
    ...h,
    promedio_estrellas: calcularPromedio(votos),
    total_votos: votos ? votos.length : 0,
  }));

  res.json(resultado);
});

// GET /hamburguesas/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('hamburguesas')
    .select('*, restaurantes(id, nombre, direccion, ciudad, telefono, imagen_url, latitud, longitud), votos(estrellas), multimedia(id, tipo, url, created_at)')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'Hamburguesa no encontrada' });

  const { votos, ...resto } = data;

  res.json({
    ...resto,
    promedio_estrellas: calcularPromedio(votos),
    total_votos: votos ? votos.length : 0,
  });
});

module.exports = router;
