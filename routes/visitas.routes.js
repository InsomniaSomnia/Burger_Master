const express = require('express');
const supabase = require('../supabase');
const verificarToken = require('../middleware/autenticacion_middleware');
const verificarRol = require('../middleware/roles_middleware');

const router = express.Router();

// POST /visitas — solo empleados
router.post('/', verificarToken, verificarRol('empleado'), async (req, res) => {
  const { fecha_visita } = req.body;
  const usuario_id = req.usuario.id;
  const restaurante_id = req.usuario.restaurante_id;

  if (!restaurante_id) {
    return res.status(403).json({ error: 'El empleado no tiene restaurante asignado' });
  }

  const { data, error } = await supabase
    .from('visitas')
    .insert({ usuario_id, restaurante_id, fecha_visita: fecha_visita || new Date().toISOString() })
    .select('id, usuario_id, restaurante_id, fecha_visita')
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ visita: data });
});

// GET /visitas/:restaurante_id — empleado de ese restaurante + admin
router.get('/:restaurante_id', verificarToken, verificarRol('empleado', 'admin'), async (req, res) => {
  const { restaurante_id } = req.params;
  const { rol, restaurante_id: restEmpleado } = req.usuario;

  if (rol === 'empleado' && String(restEmpleado) !== String(restaurante_id)) {
    return res.status(403).json({ error: 'No tienes acceso a las visitas de este restaurante' });
  }

  const { data, error } = await supabase
    .from('visitas')
    .select('id, usuario_id, restaurante_id, fecha_visita')
    .eq('restaurante_id', restaurante_id)
    .order('fecha_visita', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

module.exports = router;
