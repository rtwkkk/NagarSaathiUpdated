const express = require('express');
const cors = require('cors');
const { pool, initDb } = require('./db');
const { sendTemplateMessage } = require('./whatsappService');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB on start
initDb();

// 1. Subscribe User
app.post('/api/subscribe', async (req, res) => {
    const { phone_number, state, district, city, ward } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO users (phone_number, state, district, city, ward, subscribed) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (phone_number) 
       DO UPDATE SET state = EXCLUDED.state, district = EXCLUDED.district, city = EXCLUDED.city, ward = EXCLUDED.ward, subscribed = TRUE 
       RETURNING *`,
            [phone_number, state, district, city, ward, true]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Subscription failed' });
    }
});

// 2. Create Alert (Admin)
app.post('/api/alerts/create', async (req, res) => {
    const { title, message, alert_type, target_area } = req.body;
    // target_area example: { city: "Ranchi", ward: "12" }

    try {
        const result = await pool.query(
            `INSERT INTO alerts (title, message, alert_type, target_area, status) 
       VALUES ($1, $2, $3, $4, 'DRAFT') 
       RETURNING *`,
            [title, message, alert_type, target_area]
        );
        res.json({ success: true, alert: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Alert creation failed' });
    }
});

// 3. Verify Alert & Send WhatsApp
app.post('/api/alerts/verify', async (req, res) => {
    const { alertId, verifiedBy } = req.body;

    try {
        // 1. Update Alert Status
        const alertResult = await pool.query(
            `UPDATE alerts SET status = 'VERIFIED', verified_by = $1 WHERE id = $2 RETURNING *`,
            [verifiedBy, alertId]
        );

        if (alertResult.rows.length === 0) {
            return res.status(404).json({ error: 'Alert not found' });
        }

        const alert = alertResult.rows[0];
        const target = alert.target_area;

        // 2. Find Target Users
        // Simple logic: If target has city, filter by city. If target has ward, filter by ward too.
        let query = `SELECT phone_number FROM users WHERE subscribed = TRUE`;
        const params = [];
        let paramIdx = 1;

        if (target.city) {
            query += ` AND city = $${paramIdx}`;
            params.push(target.city);
            paramIdx++;
        }
        if (target.ward) {
            query += ` AND ward = $${paramIdx}`;
            params.push(target.ward);
            paramIdx++;
        }

        const start = Date.now();
        const usersResult = await pool.query(query, params);

        // 3. Send WhatsApp Messages (Async - logic in background or simple loop for MVP)
        // For real production, use a queue (BullMQ/RabbitMQ). Here we just loop.
        let sentCount = 0;
        usersResult.rows.forEach(user => {
            sendTemplateMessage(user.phone_number, 'nagar_alert_template', [
                { type: 'text', text: alert.title },
                { type: 'text', text: alert.message },
                { type: 'text', text: `${target.city || ''}, ${target.ward || ''}` }
            ]).catch(err => console.error(`Failed to send to ${user.phone_number}`, err.message));
            sentCount++;
        });

        res.json({
            success: true,
            message: 'Alert verified and processing',
            target_count: usersResult.rows.length,
            alert: alert
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// 4. Get Pending Alerts (Admin)
app.get('/api/alerts/pending', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM alerts WHERE status = 'DRAFT' ORDER BY created_at DESC`
        );
        res.json({ success: true, alerts: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch pending alerts' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
