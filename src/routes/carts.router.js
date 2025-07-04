const express = require('express');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cartManager = new CartManager();

router.post('/', (req, res, next) => {
    try {
        const newCart = cartManager.createCart();
        res.status(201).json({ cart: newCart });
    } catch (error) {
        next(error);
    }
});

router.get('/:cid', (req, res, next) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = cartManager.getCartById(cartId);
        res.json({ cart });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.post('/:cid/product/:pid', (req, res, next) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1;

        const updatedCart = cartManager.addProductToCart(cartId, productId, quantity);
        res.json({ cart: updatedCart });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

module.exports = router;