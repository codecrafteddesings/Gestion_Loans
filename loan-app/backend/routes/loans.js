const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const mongoose = require('mongoose');
const Client = require('../models/Cliente');
const { addDays, addWeeks, addMonths, addYears, format } = require('date-fns');

function calculateDueDate(term, frequency) {
    const now = new Date();
    let dueDate;

    switch (frequency) {
        case 'daily':
            dueDate = addDays(now, term * 2);
            break;
        case 'weekly':
            dueDate = addWeeks(now, term * 1 );
            break;
        case 'biweekly':
            dueDate = addDays(now, term * 14); // Quincenal (cada 14 días)
            break;
        case 'monthly':
            dueDate = addMonths(now, term * 1);
            break;
        case 'yearly':
            dueDate = addYears(now, term * 1);
            break;
        default:
            throw new Error('Frecuencia de pago no válida');
    }

    return format(dueDate, 'yyyy-MM-dd');
}


// Ejemplo de uso de Client
router.get('/client/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(client);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para solicitar un préstamo
router.post('/request', async (req, res) => {
    const { clientId, amount, interestRate, term, frequency } = req.body;
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
        return res.status(400).json({ message: 'Invalid clientId' });
    }

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

// Ruta para buscar préstamos por cliente o estado
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const loans = await Loan.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { status: { $regex: query, $options: 'i' } }
            ]
        }).populate('clientId', 'name email');
        res.json(loans);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para actualizar un préstamo
router.put('/update/:id', async (req, res) => {
    const { clientId, amount, interestRate, term, frequency, status } = req.body;
    if (clientId && !mongoose.Types.ObjectId.isValid(clientId)) {
        return res.status(400).json({ message: 'Invalid clientId' });
    }

    try {
        let loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }
        loan.clientId = clientId || loan.clientId;
        loan.amount = amount || loan.amount;
        loan.interestRate = interestRate || loan.interestRate;
        loan.term = term || loan.term;
        loan.frequency = frequency || loan.frequency;
        loan.status = status || loan.status;

        await loan.save();
        res.json({ message: 'Préstamo actualizado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para eliminar un préstamo
router.delete('/delete/:id', async (req, res) => {
    try {
        await Loan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Préstamo eliminado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para obtener préstamos en mora
router.get('/defaulted', async (req, res) => {
    try {
        const loans = await Loan.find({
            dueDate: { $lte: new Date() },
            status: { $ne: 'paid' }
        }).populate('clientId', 'name email');
        res.json(loans);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para obtener préstamos en atraso
router.get('/late', async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    try {
        const loans = await Loan.find({
            dueDate: { $gt: thirtyDaysAgo, $lt: new Date() },
            status: { $ne: 'paid' }
        }).populate('clientId', 'name email');
        res.json(loans);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;