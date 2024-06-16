// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://codecrafteddesings:Password123@cluster0.0ds0hbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true, // Estas opciones se pueden dejar si la versión de mongoose lo requiere
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
