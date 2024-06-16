const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// Ruta para solicitar un préstamo
router.post('/request', async (req, res) => {
    const { clientId, amount, interestRate, term, frequency } = req.body;
    try {
        const dueDate = calculateDueDate(term, frequency);
        const loan = new Loan({
            clientId,
            amount,
            interestRate,
            term,
            frequency,
            dueDate
        });
        await loan.save();
        res.status(201).json({ message: 'Préstamo solicitado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para obtener todos los préstamos
router.get('/', async (req, res) => {
    try {
        const loans = await Loan.find().populate('clientId', 'name email');
        res.json(loans);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

function calculateDueDate(term, frequency) {
    const now = new Date();
    if (frequency === 'daily') {
        now.setDate(now.getDate() + term);
    } else if (frequency === 'weekly') {
        now.setDate(now.getDate() + term * 7);
    } else if (frequency === 'monthly') {
        now.setMonth(now.getMonth() + term);
    }
    return now;
}

module.exports = router;
