// import mysql from 'mysql2/promise';
// import mysql from 'mysql2';
const mysql = require("mysql2/promise");
import fs from 'fs';
import path from 'path';
require('dotenv').config();
import 'dotenv/config';

export default async function handler(req, res) {

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

    // Connect to the MySQL database
    const connection = mysql.createPool({
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

    // Your database query goes here

    const [rows] = await connection.execute('SELECT 1');
    // Close the database connection
    await connection.end();

    res.status(200).json(rows);
    // Send a response back to the client
    //res.status(200).json({ message: 'Connection to database was successful' });
}