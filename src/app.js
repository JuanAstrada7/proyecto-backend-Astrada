const express = require('express');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.json({
        message: 'API funcionando correctamente',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts'
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Endpoints disponibles:`);
    console.log(`- Productos: http://localhost:${PORT}/api/products`);
    console.log(`- Carritos: http://localhost:${PORT}/api/carts`);
});