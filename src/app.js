require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const connectDB = require('./config/database');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

const configureSocket = require('./socket/socketManager');

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = 8080;

connectDB();

app.set('io', io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: {
        multiply: function (a, b) {
            return a * b;
        },
        eq: function (a, b) {
            return a === b;
        },
        calculateTotal: function (products) {
            return products.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));

configureSocket(io);

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/api', (req, res) => {
    res.json({
        message: 'API funcionando correctamente',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts',
            home: '/',
            realtime: '/realtimeproducts'
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
    });
});

server.listen(PORT, () => {
    console.log(` Servidor F1 Toys Store corriendo en http://localhost:${PORT}`);
    console.log(`   - Home: http://localhost:${PORT}/`);
    console.log(`   - Productos en Tiempo Real: http://localhost:${PORT}/realtimeproducts`);
    console.log(`   - API Productos: http://localhost:${PORT}/api/products`);
    console.log(`   - API Carritos: http://localhost:${PORT}/api/carts`);
});