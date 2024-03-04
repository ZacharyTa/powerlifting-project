import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
require('dotenv').config();
import 'dotenv/config';

export async function query({ query, values = [] }) {

    // Construct the paths to certificate files based on your environment variables
    const caPath = path.resolve(process.env.SSL_CA_PATH);
    const certPath = path.resolve(process.env.SSL_CERT_PATH);
    const keyPath = path.resolve(process.env.SSL_KEY_PATH);

    // Read the certificate and key files
    const ca = fs.readFileSync(caPath, 'utf8');
    const cert = fs.readFileSync(certPath, 'utf8');
    const key = fs.readFileSync(keyPath, 'utf8');

    // Check if the certificate files exist
    if (!fs.existsSync(caPath) || !fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
        return res.status(500).json({ error: 'Certificate file paths are invalid or files do not exist.' });
    }
    try {

        // Connect to the MySQL database
        const db_connection = mysql.createPool({
            port: process.env.DB_PORT,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            ssl: {
                ca: ca,
                key: key,
                cert: cert,
                // Bypass verification False (development only): Remove later
                rejectUnauthorized: true,
            },
        });

        const [results] = await db_connection.execute(query, values);

    return results;

    } catch (error) {
        throw Error(error.message);
    }
}


// The replay may be late. But for future reference, the issue is that the transaction only works in a single connection but not in a pool. So getConnection() should be used first to get a connection from the pool. Example below:

// const mysql = require('mysql2/promise'); 
// const pool = mysql.createPool({...});

// let conn = null;
// try {
//   conn = await pool.getConnection();
//   await conn.query("START TRANSACTION");
//   const [response, meta] = await conn.query("SELECT * FROM xxx FOR UPDATE");
//   await conn.execute("INSERT INTO xxxxxx");
//   await conn.query("COMMIT");
// } catch (error) {
//   if (conn) await conn.query("ROLLBACK");
//   throw error;
// } finally {
//   if (conn) conn.release();
// }

// const connection = await pool.getConnection();
// const username = req.query.username; // Assuming username comes from query parameter

// const query = `SELECT * FROM users WHERE username = ?`;
// const [rows] = await connection.execute(query, [username]);

// await connection.release();