const express = require('express');
const supabase = require('../supabase');
const verificarToken = require('../middleware/autenticacion_middleware');
const verificarRol = require('../middleware/roles_middleware');

const router = express.Router();

// GET /admin/usuarios — lista todos los usuarios
router.get('/usuarios', verificarToken, verificarRol('admin'), async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, username, rol, restaurante_id, estado, created_at')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// GET /admin/usuarios/pendientes — empleados esperando aprobación
router.get('/usuarios/pendientes', verificarToken, verificarRol('admin'), async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, username, rol, restaurante_id, created_at')
    .eq('rol', 'empleado')
    .eq('estado', 'pendiente')
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// PATCH /admin/usuarios/:id/aprobar — aprueba un empleado pendiente
router.patch('/usuarios/:id/aprobar', verificarToken, verificarRol('admin'), async (req, res) => {
  const { id } = req.params;

  const { data: usuario, error: errBuscar } = await supabase
    .from('usuarios')
    .select('id, rol, estado')
    .eq('id', id)
    .single();

  if (errBuscar || !usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (usuario.rol !== 'empleado') {
    return res.status(400).json({ error: 'Solo se pueden aprobar empleados' });
  }

  if (usuario.estado === 'activo') {
    return res.status(409).json({ error: 'El empleado ya está aprobado' });
  }

  const { data, error } = await supabase
    .from('usuarios')
    .update({ estado: 'activo' })
    .eq('id', id)
    .select('id, username, rol, restaurante_id, estado')
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ usuario: data });
});

// PATCH /admin/usuarios/:id/rechazar — rechaza y elimina un empleado pendiente
router.patch('/usuarios/:id/rechazar', verificarToken, verificarRol('admin'), async (req, res) => {
  const { id } = req.params;

  const { data: usuario, error: errBuscar } = await supabase
    .from('usuarios')
    .select('id, rol, estado')
    .eq('id', id)
    .single();

  if (errBuscar || !usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (usuario.rol !== 'empleado' || usuario.estado !== 'pendiente') {
    return res.status(400).json({ error: 'Solo se pueden rechazar empleados pendientes' });
  }

  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ mensaje: 'Empleado rechazado y eliminado' });
});

module.exports = router;
