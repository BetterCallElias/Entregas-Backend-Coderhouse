const fs = require('fs');
const cartsFile = './carts.json';

async function readCarts() {
  try {
    const data = await fs.promises.readFile(cartsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // El archivo no existe, así que retornamos un arreglo vacío
      return [];
    }
    console.error('Error al leer el archivo carts.json:', error);
    return [];
  }
}

async function findCartById(id) {
  const carts = await readCarts();
  const stringId = String(id); 
  return carts.find(cart => cart.id === stringId);
}

async function generateCartId() {
  const carts = await readCarts();
  if (carts.length === 0) {
    return '1'; 
  }
  const lastId = carts.reduce((max, cart) => Math.max(max, parseInt(cart.id)), 0);
  return String(lastId + 1);
}

async function addCart(cart) {
  const carts = await readCarts();
  carts.push(cart);
  await writeCarts(carts);
}

async function updateCart(id, updatedCart) {
  const carts = await readCarts();
  const cartIndex = carts.findIndex(cart => cart.id === String(id)); // Convertir id a cadena
  if (cartIndex !== -1) {
      carts[cartIndex] = updatedCart;
      await writeCarts(carts);
      return true;
  } else {
      console.error(`Carrito con ID ${id} no encontrado`);
      return false;
  }
}

async function writeCarts(carts) {
  const data = JSON.stringify(carts, null, 2);
  await fs.promises.writeFile(cartsFile, data, 'utf-8');
}

module.exports = {
  readCarts,
  findCartById,
  generateCartId,
  addCart,
  updateCart,
  writeCarts,
};