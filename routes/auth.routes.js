const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

const router = express.Router();

router.post('/registrar', async (req, res) => {
  const { username, password, rol, restaurante_id } = req.body;

  if (!username || !password || !rol) {
    return res.status(400).json({ error: 'username, password y rol son requeridos' });
  }

  if (rol === 'admin') {
    return res.status(403).json({ error: 'No es posible registrar administradores por esta vía' });
  }

  if (!['cliente', 'empleado'].includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  if (rol === 'empleado' && !restaurante_id) {
    return res.status(400).json({ error: 'Los empleados deben indicar un código de restaurante' });
  }

  let restauranteUUID = null;

  if (rol === 'empleado') {
    const { data: restaurante } = await supabase
      .from('restaurantes')
      .select('id')
      .eq('id', restaurante_id)
      .single();

    if (!restaurante) {
      return res.status(404).json({ error: 'Código de restaurante inválido' });
    }

    restauranteUUID = restaurante.id;
  }

  const { data: existente } = await supabase
    .from('usuarios')
    .select('id')
    .eq('username', username)
    .single();

  if (existente) {
    return res.status(409).json({ error: 'El username ya está en uso' });
  }

  const hash = await bcrypt.hash(password, 10);
  const estado = rol === 'empleado' ? 'pendiente' : 'activo';

  const { data, error } = await supabase
    .from('usuarios')
    .insert({ username, password: hash, rol, restaurante_id: restauranteUUID, estado })
    .select('id, username, rol, restaurante_id, estado, created_at')
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ usuario: data });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son requeridos' });
  }

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('id, username, password, rol, restaurante_id, estado')
    .eq('username', username)
    .single();

  if (error || !usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const coincide = await bcrypt.compare(password, usuario.password);
  if (!coincide) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  if (usuario.estado === 'pendiente') {
    return res.status(403).json({ error: 'Tu cuenta está pendiente de aprobación por un administrador' });
  }

  const token = jwt.sign(
    { id: usuario.id, username: usuario.username, rol: usuario.rol, restaurante_id: usuario.restaurante_id },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
});

module.exports = router;
