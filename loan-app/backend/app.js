const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cron = require('node-cron');
const Loan = require('./models/Loan');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Import routes
const clientesRoutes = require('./routes/clientes');
const loansRoutes = require('./routes/loans');
const paymentsRoutes = require('./routes/payments');

// Use routes
app.use('/api/clientes', clientesRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/payments', paymentsRoutes);

// Configuración del cron job para actualizar el estado de los préstamos
cron.schedule('0 0 * * *', async () => {
    try {
        const loans = await Loan.find({ status: 'active' });
        const now = new Date();
        
        for (let loan of loans) {
            if (loan.dueDate < now) {
                loan.status = 'overdue';
                await loan.save();
            }
        }
        
        console.log('Estado de préstamos actualizado');
    } catch (error) {
        console.error('Error al actualizar el estado de los préstamos:', error.message);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
