const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res, next) => {
    try {
        const { limit, page, sort, query } = req.query;
        
        const options = {
            limit: limit || 10,
            page: page || 1,
            sort: sort || null,
            query: {}
        };

        if (query) {
            try {
                const parsedQuery = JSON.parse(query);
                options.query = parsedQuery;
            } catch (e) {
                if (query) {
                    options.query.category = query;
                }
            }
        }

        const result = await productManager.getProducts(options);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get('/:pid', async (req, res, next) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.json({ status: 'success', payload: product });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        
        req.app.get('io').emit('productAdded', newProduct);
        
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        error.status = 400;
        next(error);
    }
});

router.put('/:pid', async (req, res, next) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        
        req.app.get('io').emit('productUpdated', updatedProduct);
        
        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

router.delete('/:pid', async (req, res, next) => {
    try {
        const deletedProduct = await productManager.deleteProduct(req.params.pid);
        
        req.app.get('io').emit('productDeleted', req.params.pid);
        
        res.json({ status: 'success', payload: deletedProduct });
    } catch (error) {
        error.status = 404;
        next(error);
    }
});

module.exports = router;