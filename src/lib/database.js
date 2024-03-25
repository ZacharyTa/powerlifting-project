import mysql from "mysql2/promise";
import { Connector } from "@google-cloud/cloud-sql-connector";
import { GoogleAuth } from "google-auth-library";

export async function query({ query, values = [] }) {
  // Construct service account credentials object directly from environment variables
  const keys = {
    type: "service_account",
    project_id: process.env.GCP_PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  };

  // Initialize GoogleAuth with service account credentials
  const auth = new GoogleAuth({
    credentials: keys,
    scopes: ["https://www.googleapis.com/auth/sqlservice.admin"],
  });

  // Initialize  Cloud SQL Connector with custom GoogleAuth client
  const connector = new Connector({ auth });

  // Get the connection from Cloud SQL instance using the connector
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.CLOUD_SQL_CONNECTION_NAME,
    ipType: "PUBLIC",
  });

  try {
    // Create a pool using mysql2/promise and the options from the Cloud SQL Connector
    const pool = mysql.createPool({
      ...clientOpts,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      // SSL configuration is handled automatically by the connector
    });

    const [results] = await pool.execute(query, values);
    return results;
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw new Error(error.message);
  }
}
