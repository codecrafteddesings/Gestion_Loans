const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Loan = require('../models/Loan');
const Cliente = require('../models/Cliente');

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('clientId', 'name');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ruta para registrar un pago
router.post('/', async (req, res) => {
    const { loanId, clientId, amount } = req.body; // Asegúrate de recibir clientId
    try {
        const payment = new Payment({
            loanId,
            clientId,  // Incluyendo clientId en el nuevo pago
            amount,
            date: new Date()
        });
        await payment.save();

        // Actualizar el estado del préstamo
        const loan = await Loan.findById(loanId);
        loan.amountPaid = (loan.amountPaid || 0) + amount;
        if (loan.amountPaid >= loan.amount) {
            loan.status = 'paid';
        }
        await loan.save();

        res.status(201).json({ message: 'Pago registrado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Nueva ruta para obtener todos los pagos de un préstamo específico
router.get('/loan/:loanId', async (req, res) => {
    const { loanId } = req.params;
    try {
        const payments = await Payment.find({ loanId }).populate('clientId', 'name');
        res.json(payments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para obtener todos los pagos
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find().populate('clientId', 'name');
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;