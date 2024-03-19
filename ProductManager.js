const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.productIdCounter = 1;
        this.loadProductsFromFile();
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            const lastProduct = this.products[this.products.length - 1];
            if (lastProduct) {
                this.productIdCounter = lastProduct.id + 1;
            }
        } catch (error) {
            this.products = [];
        }
    }

    saveProductsToFile() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.path, data);
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

const productManager = new ProductManager('products.json');

// Ejemplo de uso
try {
    productManager.addProduct({
        title: "producto prueba",
        description: "Este es un producto prueba",
        price: 200,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 25
    });
} catch (error) {
    console.error("Error al agregar producto:", error.message);
}

console.log("Productos:", productManager.getProducts());

try {
    productManager.updateProduct(1, { price: 250, stock: 30 });
} catch (error) {
    console.error("Error al actualizar producto:", error.message);
}

console.log("Productos actualizados:", productManager.getProducts());

try {
    productManager.deleteProduct(1);
} catch (error) {
    console.error("Error al eliminar producto:", error.message);
}

console.log("Productos después de eliminar:", productManager.getProducts());