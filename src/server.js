const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración del motor de plantillas Handlebars (corregida)
app.engine('handlebars', exphbs.create({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz
app.get('/', (req, res) => {
  res.render('home'); // Renderiza la vista home.handlebars
});

// Rutas para productos y carritos (asumiendo que existen archivos routes/products.js y routes/carts.js)
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Manejo de eventos y lógica de comunicación WebSocket

});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));