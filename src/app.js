const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

const productManager = new ProductManager('products.json');


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});



app.get('/products', async (req, res, next) => {
    try {
        await productManager.loadProductsFromFile();
        let products = productManager.getProducts();
        const limit = parseInt(req.query.limit);
        if (!isNaN(limit)) {
            products = products.slice(0, limit);
        }
        res.json(products);
    } catch (error) {
        next(error);
    }
});



app.get('/products/:pid', async (req, res, next) => {
    try {
        await productManager.loadProductsFromFile();
        const productId = parseInt(req.params.pid);
        const product = productManager.getProductById(productId);
        res.json(product);
    } catch (error) {
        next(error);
    }
});



app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});