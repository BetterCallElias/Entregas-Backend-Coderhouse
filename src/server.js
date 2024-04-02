const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));



const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');



app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);