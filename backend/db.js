const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const initDb = async () => {
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');

        // Users Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(15) UNIQUE NOT NULL,
        state VARCHAR(50),
        district VARCHAR(50),
        city VARCHAR(50),
        ward VARCHAR(50),
        subscribed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Alerts Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        alert_type VARCHAR(20) NOT NULL,
        target_area JSONB,
        status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, VERIFIED, SENT
        verified_by VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        await client.query('COMMIT');
        console.log('Database initialized successfully');
    } catch (e) {
        if (client) await client.query('ROLLBACK');
        console.error('Error initializing database:', e.message);
    } finally {
        if (client) client.release();
    }
};

module.exports = { pool, initDb };
