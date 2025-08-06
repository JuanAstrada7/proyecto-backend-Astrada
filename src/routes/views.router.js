const express = require('express');
const ProductManager = require('../managers/ProductManager');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
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
        res.render('home', { 
            products: result.payload,
            pagination: {
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink
            }
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.render('home', { products: [], pagination: {} });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.render('productDetail', { product });
    } catch (error) {
        console.error('Error al cargar producto:', error);
        res.status(404).render('error', { message: 'Producto no encontrado' });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        res.status(404).render('error', { message: 'Carrito no encontrado' });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const result = await productManager.getProducts({ limit: 50 });
        res.render('realTimeProducts', { products: result.payload });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        res.render('realTimeProducts', { products: [] });
    }
});

module.exports = router;