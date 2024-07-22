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

// Ruta para buscar un cliente por nombre o cédula
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const clientes = await Cliente.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { idNumber: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(clientes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para actualizar un cliente
router.put('/update/:id', async (req, res) => {
    const { name, email, phone, idNumber, address } = req.body;
    try {
        let cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        cliente.name = name || cliente.name;
        cliente.email = email || cliente.email;
        cliente.phone = phone || cliente.phone;
        cliente.idNumber = idNumber || cliente.idNumber;
        cliente.address = address || cliente.address;

        await cliente.save();
        res.json({ message: 'Cliente actualizado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para eliminar un cliente
router.delete('/delete/:id', async (req, res) => {
    try {
        await Cliente.findByIdAndDelete(req.params.id);
        res.json({ message: 'Cliente eliminado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router; 
