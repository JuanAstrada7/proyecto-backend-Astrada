const fs = require('fs');

class CartManager {
    constructor() {
        this.path = './data/carts.json';
        this.carts = [];
        this.loadCarts();
    }

    loadCarts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.carts = JSON.parse(data);
        } catch (error) {
            this.carts = [];
            this.saveCarts();
        }
    }

    saveCarts() {
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
    }

    generateId() {
        return this.carts.length > 0
            ? Math.max(...this.carts.map(c => c.id)) + 1
            : 1;
    }

    createCart() {
        const newCart = {
            id: this.generateId(),
            products: []
        };

        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(id) {
        const cart = this.carts.find(c => c.id === id);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    addProductToCart(cartId, productId, quantity = 1) {
        const cart = this.getCartById(cartId);

        const existingProduct = cart.products.find(p => p.product === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({
                product: productId,
                quantity: quantity
            });
        }

        this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;