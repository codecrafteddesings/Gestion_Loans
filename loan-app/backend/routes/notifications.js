const express = require('express');
const router = express.Router();
const { sendWhatsApp } = require('../config/notifications');

router.post('/send-whatsapp', async (req, res) => {
    const { to, message } = req.body;

    try {
        const response = await sendWhatsApp(to, message);
        res.status(200).json({ success: true, response });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
