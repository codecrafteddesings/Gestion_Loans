const twilio = require('twilio');
const config = require('config');

const accountSid = config.get('twilioAccountSid');
const authToken = config.get('twilioAuthToken');
const client = twilio(accountSid, authToken);

const sendWhatsApp = (to, message) => {
    return client.messages.create({
        body: message,
        from: 'whatsapp:+8099976928', // Número de WhatsApp proporcionado por Twilio
        to: `whatsapp:${to}`
    });
};

module.exports = { sendWhatsApp };
