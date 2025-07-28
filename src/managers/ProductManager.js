const fs = require('fs');

class ProductManager {
    constructor() {
        this.path = './data/products.json';
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
            this.saveProducts();
        }
    }

    saveProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
    }

    generateId() {
        return this.products.length > 0
            ? Math.max(...this.products.map(p => p.id)) + 1
            : 1;
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    addProduct(productData) {
        const newProduct = {
            id: this.generateId(),
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: productData.price,
            status: productData.status !== undefined ? productData.status : true,
            stock: productData.stock,
            category: productData.category,
            imageUrl: productData.imageUrl || null
        };

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    updateProduct(id, updateData) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }

        const { id: _, ...dataToUpdate } = updateData;

        this.products[index] = {
            ...this.products[index],
            ...dataToUpdate
        };

        this.saveProducts();
        return this.products[index];
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }

        const deletedProduct = this.products.splice(index, 1)[0];
        this.saveProducts();
        return deletedProduct;
    }
}

module.exports = ProductManager;