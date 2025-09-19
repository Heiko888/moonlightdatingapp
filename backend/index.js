require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  // Swagger
  const swaggerUi = require('swagger-ui-express');
  const swaggerJsdoc = require('swagger-jsdoc');
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: { title: 'HD App API', version: '1.0.0' },
    },
    apis: ['./src/routes/*.js'],
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

const server = http.createServer(app);

if (process.env.NODE_ENV !== 'test') {
  const { Server } = require('socket.io');
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('Socket verbunden', socket.id);
  });
}

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI nicht gesetzt');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('MongoDB Verbindung erfolgreich hergestellt.');
  server.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
}

if (require.main === module) {
  start();
}

module.exports = app;
