const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const { readProducts, addProduct, deleteProduct } = require('./utils/products');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.engine('handlebars', exphbs.create({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.render('home'); 
});


app.get('/realTimeProducts', (req, res) => {
  res.render('realTimeProducts');
});


io.on('connection', (socket) => {
  console.log('Cliente conectado');


  fetchProducts().then(products => {
    socket.emit('updateProducts', products);
  }).catch(error => {
    console.error('Error al obtener productos:', error);
  });


  socket.on('addProduct', async (product) => {
    try {
      await addProduct(product);
      const updatedProducts = await readProducts();
      io.emit('updateProducts', updatedProducts);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  });


  socket.on('deleteProduct', async (productId) => {
    try {
      await deleteProduct(productId);
      const updatedProducts = await readProducts();
      io.emit('updateProducts', updatedProducts);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  });
});


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));