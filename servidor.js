require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

const origenesPermitidos = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['https://burgermaster-production.up.railway.app'];

app.use(cors({ origin: origenesPermitidos }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/3D', express.static(path.join(__dirname, '3D')));

const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/login', limitadorLogin);

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
