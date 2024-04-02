const express = require('express');
const router = express.Router();


const {
  readCarts,
  findCartById,
  generateCartId,
  addCart,
  updateCart,
} = require('../utils/carts');


const { findProductById } = require('../utils/products');


router.post('/', async (req, res) => {
  const newCart = {
    id: await generateCartId(),
    products: [],
  };
  await addCart(newCart);
  res.json(newCart);
});

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cart = await findCartById(cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).send('Carrito no encontrado');
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await findCartById(cid);

  if (cart) {
    const product = await findProductById(pid);

    if (product) {
      const existingProduct = cart.products.find(p => p.product === String(pid)); // Convertir pid a string

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ product: String(pid), quantity: 1 }); // Convertir pid a string
      }

      
      await updateCart(cid, cart);

      res.json(cart.products);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } else {
    res.status(404).send('Carrito no encontrado');
  }
});

module.exports = router;