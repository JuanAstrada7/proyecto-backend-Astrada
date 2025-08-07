const express = require('express');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cartManager = new CartManager();

router.post('/', async (req, res, next) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        next(error);
    }
});

router.get('/:cid', async (req, res, next) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.post('/:cid/product/:pid', async (req, res, next) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = (req.body && req.body.quantity) ? req.body.quantity : 1;

        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.delete('/:cid/products/:pid', async (req, res, next) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.removeProductFromCart(cartId, productId);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.put('/:cid', async (req, res, next) => {
    try {
        const cartId = req.params.cid;
        const products = (req.body && req.body.products) ? req.body.products : [];

        const updatedCart = await cartManager.updateCart(cartId, products);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.put('/:cid/products/:pid', async (req, res, next) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body && req.body.quantity;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                status: 'error',
                message: 'La cantidad debe ser mayor a 0'
            });
        }

        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.delete('/:cid', async (req, res, next) => {
    try {
        const cartId = req.params.cid;
        const clearedCart = await cartManager.clearCart(cartId);
        res.json({ status: 'success', payload: clearedCart });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

module.exports = router;