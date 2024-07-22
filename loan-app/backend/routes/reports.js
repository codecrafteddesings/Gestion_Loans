const express = require('express');
const router = express.Router();
const Client = require('../models/Cliente');
const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

router.get('/summary', async (req, res) => {
  try {
    const totalClientes = await Client.countDocuments();
    const totalPrestamos = await Loan.countDocuments();
    const totalMora = await Loan.countDocuments({ status: 'mora' });

    res.json({ totalClientes, totalPrestamos, totalMora });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ message: 'Error fetching summary' });
  }
});

router.get('/recent-payments', async (req, res) => {
  try {
    const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(5).populate({
      path: 'loanId',
      populate: {
        path: 'clientId',
        model: 'Cliente'
      }
    });
    
    // Transformar los pagos para asegurar que clientId tenga la información adecuada
    const paymentsWithClientInfo = recentPayments.map(payment => {
      const { loanId } = payment;
      const client = loanId ? loanId.clientId : null;

      return {
        ...payment.toObject(),
        client: client ? { name: client.name } : { name: 'Cliente no encontrado' }
      };
    });

    res.json(paymentsWithClientInfo);
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    res.status(500).json({ message: 'Error fetching recent payments' });
  }
});

module.exports = router;