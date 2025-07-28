const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res, next) => {
    try {
        const products = await productManager.getProducts();
        res.json({ products });
    } catch (error) {
        next(error);
    }
});

router.get('/:pid', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        res.json({ product });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newProduct = await productManager.addProduct(req.body);

        req.app.get('io').emit('productAdded', newProduct);

        res.status(201).json({ product: newProduct });
    } catch (error) {
        error.status = 400;
        next(error);
    }
});

router.put('/:pid', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedProduct = await productManager.updateProduct(productId, req.body);

        req.app.get('io').emit('productUpdated', updatedProduct);

        res.json({ product: updatedProduct });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.delete('/:pid', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid);
        const deletedProduct = await productManager.deleteProduct(productId);

        req.app.get('io').emit('productDeleted', productId);

        res.json({ message: 'Producto eliminado', product: deletedProduct });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

module.exports = router;