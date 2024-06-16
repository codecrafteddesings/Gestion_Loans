const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Loan = require('../models/Loan');

router.post('/', async (req, res) => {
    const { loanId, amount } = req.body;
    try {
        const payment = new Payment({
            loanId,
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

module.exports = router;