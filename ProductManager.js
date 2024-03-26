const fs = require('fs').promises;

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.productIdCounter = 1;
    }

    async loadProductsFromFile() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
            const lastProduct = this.products[this.products.length - 1];
            if (lastProduct) {
                this.productIdCounter = lastProduct.id + 1;
            }
        } catch (error) {
            this.products = [];
        }
    }

    async saveProductsToFile() {
        const data = JSON.stringify(this.products, null, 2);
        await fs.writeFile(this.path, data);
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            throw new Error("Todos los campos son obligatorios.");
        }

        const existingProduct = this.products.find(p => p.code === product.code);
        if (existingProduct) {
            throw new Error(`El producto con código ${product.code} ya existe.`);
        }

        product.id = this.productIdCounter++;
        this.products.push(product);
        this.saveProductsToFile();
        console.log(`Producto agregado con id ${product.id}.`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error("Producto no encontrado.");
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado.");
        }

        this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
        this.saveProductsToFile();
    }

    deleteProduct(id) {
        const updatedProducts = this.products.filter(p => p.id !== id);
        if (updatedProducts.length === this.products.length) {
            throw new Error("Producto no encontrado.");
        }

        this.products = updatedProducts;
        this.saveProductsToFile();
    }
}

module.exports = ProductManager;