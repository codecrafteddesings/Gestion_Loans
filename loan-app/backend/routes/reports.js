// routes/reports.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

// Obtener reportes de préstamos activos
router.get('/loans', auth, async (req, res) => {
    try {
        const loans = await Loan.find({ lender: req.user.id, status: 'activo' }).populate('borrower', 'name email');
        res.json(loans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Obtener reportes de pagos realizados
router.get('/payments', auth, async (req, res) => {
    try {
        const payments = await Payment.find({ status: 'pagado' }).populate('loan');
        res.json(payments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Obtener estadísticas de rendimiento del prestamista
router.get('/statistics', auth, async (req, res) => {
    try {
        const loans = await Loan.find({ lender: req.user.id });
        const payments = await Payment.find({ loan: { $in: loans.map(loan => loan._id) } });

        const totalLoans = loans.length;
        const totalPayments = payments.length;
        const totalAmountLent = loans.reduce((acc, loan) => acc + loan.amount, 0);
        const totalAmountPaid = payments.reduce((acc, payment) => acc + payment.amount, 0);

        const statistics = {
            totalLoans,
            totalPayments,
            totalAmountLent,
            totalAmountPaid,
        };

        res.json(statistics);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
