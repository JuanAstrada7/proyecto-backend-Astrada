const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

router.get('/', (req, res, next) => {
    try {
        const products = productManager.getProducts();
        res.json({ products });
    } catch (error) {
        next(error);
    }
});

router.get('/:pid', (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = productManager.getProductById(productId);
        res.json({ product });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.post('/', (req, res, next) => {
    try {
        const newProduct = productManager.addProduct(req.body);
        res.status(201).json({ product: newProduct });
    } catch (error) {
        error.status = 400;
        next(error);
    }
});

router.put('/:pid', (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedProduct = productManager.updateProduct(productId, req.body);
        res.json({ product: updatedProduct });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.delete('/:pid', (req, res, next) => {
    try {
        const productId = parseInt(req.params.pid);
        const deletedProduct = productManager.deleteProduct(productId);
        res.json({ message: 'Producto eliminado', product: deletedProduct });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

module.exports = router;