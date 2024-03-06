import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

export async function query({ query, values = [] }) {
  const caPath = path.resolve(process.env.SSL_CA_PATH);
  const certPath = path.resolve(process.env.SSL_CERT_PATH);
  const keyPath = path.resolve(process.env.SSL_KEY_PATH);

  const ca = fs.readFileSync(caPath, "utf8");
  const cert = fs.readFileSync(certPath, "utf8");
  const key = fs.readFileSync(keyPath, "utf8");

  if (
    !fs.existsSync(caPath) ||
    !fs.existsSync(certPath) ||
    !fs.existsSync(keyPath)
  ) {
    return res.status(500).json({
      error: "Certificate file paths are invalid or files do not exist.",
    });
  }
  try {
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
        rejectUnauthorized: false,
      },
    });
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    throw Error(error.message);
  }
}
