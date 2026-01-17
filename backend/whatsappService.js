const axios = require('axios');
require('dotenv').config();

const sendTemplateMessage = async (to, templateName, parameters) => {
    const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    // Basic body structure for Cloud API
    const body = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
            name: templateName,
            language: { code: 'en' },
            components: [
                {
                    type: 'body',
                    parameters: parameters
                }
            ]
        }
    };

    try {
        const response = await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Message sent to ${to}:`, response.data);
        return response.data;
    } catch (error) {
        console.error('WhatsApp API Error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = { sendTemplateMessage };
