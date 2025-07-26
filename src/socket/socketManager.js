const ProductManager = require('../managers/ProductManager');

function configureSocket(io) {
    const productManager = new ProductManager('./data/products.json');

    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        socket.on('addProduct', async (productData) => {
            try {
                const newProduct = await productManager.addProduct(productData);
                console.log('Producto agregado:', newProduct);

                io.emit('productAdded', newProduct);

                const products = await productManager.getProducts();
                io.emit('productsUpdated', products);

            } catch (error) {
                console.error('Error al agregar producto:', error);
                socket.emit('error', error.message);
            }
        });

        socket.on('deleteProduct', async (productId) => {
            try {
                await productManager.deleteProduct(productId);
                console.log('Producto eliminado:', productId);

                io.emit('productDeleted', productId);

                const products = await productManager.getProducts();
                io.emit('productsUpdated', products);

            } catch (error) {
                console.error('Error al eliminar producto:', error);
                socket.emit('error', error.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });
}

module.exports = configureSocket;