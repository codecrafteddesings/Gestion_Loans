const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Ruta para obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para registrar un nuevo cliente
router.post('/register', async (req, res) => {
    const { name, email, phone, idNumber, address } = req.body;
    try {
        let cliente = await Cliente.findOne({ email });
        if (cliente) {
            return res.status(400).json({ message: 'Cliente ya registrado' });
        }
        cliente = new Cliente({
            name,
            email,
            phone,
            idNumber,
            address
        });
        await cliente.save();
        res.status(201).json({ message: 'Cliente registrado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
