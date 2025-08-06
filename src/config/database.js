const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/f1-toys-store';
        
        const conn = await mongoose.connect(mongoURI);
        
        console.log(`MongoDB Atlas conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error conectando a MongoDB Atlas:', error);
        process.exit(1);
    }
};

module.exports = connectDB;