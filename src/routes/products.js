const express = require('express');
const router = express.Router();
const { readProducts, findProductById, generateProductId, addProduct, updateProduct, deleteProduct } = require('../utils/products');

router.get('/', async (req, res) => {
  const products = await readProducts();
  const { limit } = req.query;
  if (limit) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
});

router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await findProductById(pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

router.post('/', async (req, res) => {
  const newProduct = req.body;
  newProduct.id = await generateProductId();
  await addProduct(newProduct);
  res.json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;
  if (await updateProduct(pid, updatedProduct)) {
    res.json(updatedProduct);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  if (await deleteProduct(pid)) {
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

module.exports = router;