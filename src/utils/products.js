const fs = require('fs');
const productsFile = './products.json';

async function readProducts() {
    const data = await fs.promises.readFile(productsFile, 'utf-8');
    return JSON.parse(data);
}

async function findProductById(id) {
    const products = await readProducts();
    const numericId = parseInt(id); 
    return products.find(product => product.id === numericId);
}

async function generateProductId() {
    const products = await readProducts();
    const lastId = products.reduce((max, product) => Math.max(max, parseInt(product.id)), 0);
    let newId = lastId + 1;
    while (products.some(product => product.id === String(newId))) {
      newId++;
    }
    return String(newId);
  }

async function addProduct(product) {
    const products = await readProducts();
    product.id = await generateProductId();
    products.push(product);
    await writeProducts(products);
}

async function updateProduct(id, updatedProduct) {
    const products = await readProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
        updatedProduct.id = id;
        products[productIndex] = updatedProduct;
        await writeProducts(products);
        return true;
    }
    return false;
}

async function deleteProduct(id) {
    const products = await readProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        await writeProducts(products);
        return true;
    }
    return false;
}

async function writeProducts(products) {
    const data = JSON.stringify(products, null, 2);
    await fs.promises.writeFile(productsFile, data, 'utf-8');
}

module.exports = { readProducts, findProductById, generateProductId, addProduct, updateProduct, deleteProduct };