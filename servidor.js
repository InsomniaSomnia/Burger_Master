// Cargar variables de entorno
require('dotenv').config();

// Importar librerías
const express = require('express');
const cors = require('cors');
const path = require('path');

// Conexión a Supabase
const supabase = require('./supabase');

// Configuración del servidor
const app = express();
app.use(express.json());
app.use(cors());

// Archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba
app.get('/ping', (req, res) => {
  res.json({ message: 'Servidor Burger Master funcionando' });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});