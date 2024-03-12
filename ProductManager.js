class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
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
}


const productManager = new ProductManager();


const initialProducts = productManager.getProducts();
console.log("Productos iniciales:", initialProducts);


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


const updatedProducts = productManager.getProducts();
console.log("Productos actualizados:", updatedProducts);


try {
    productManager.addProduct({
        title: "otro producto",
        description: "Otro producto de prueba",
        price: 150,
        thumbnail: "Otra imagen",
        code: "abc123", // Código repetido
        stock: 30
    });
} catch (error) {
    console.error("Error al agregar producto:", error.message);
}


const productIdToFind = 1;
try {
    const foundProduct = productManager.getProductById(productIdToFind);
    console.log("Producto encontrado:", foundProduct);
} catch (error) {
    console.error("Error al buscar producto:", error.message);
}