require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/config', (req, res) => {
  res.json({
    supabaseUrl:     process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  });
});

app.use('/', require('./routes/auth.routes'));
app.use('/hamburguesas', require('./routes/hamburguesas.routes'));
app.use('/restaurantes', require('./routes/restaurantes.routes'));
app.use('/votos', require('./routes/votos.routes'));
app.use('/visitas', require('./routes/visitas.routes'));
app.use('/admin', require('./routes/admin.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
