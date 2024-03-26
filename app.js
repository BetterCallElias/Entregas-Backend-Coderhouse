const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000;

const productManager = new ProductManager('products.json');

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Ruta para obtener todos los productos con un límite opcional
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

// Ruta para obtener un producto por su ID
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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});