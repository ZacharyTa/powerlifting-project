import mysql from "mysql2/promise";
import path from "path";
import fs from "fs";
import { Connector } from "@google-cloud/cloud-sql-connector";
import { GoogleAuth } from "google-auth-library";

// Function to get the private key
function getPrivateKey() {
  let privateKey;
  try {
    if (path.isAbsolute(process.env.PRIVATE_KEY_PATH)) {
      const credFilePath = process.env.PRIVATE_KEY_PATH;
      const fileContent = fs.readFileSync(path.resolve(credFilePath), "utf8");
      privateKey = JSON.parse(fileContent)["private_key"];
    } else if (process.env.GCP_PRIVATE_KEY) {
      privateKey = process.env.GCP_PRIVATE_KEY;
    } else {
      throw new Error("No PRIVATE_KEY_PATH or GCP_PRIVATE_KEY provided");
    }
  } catch (error) {
    console.error(
      `Error reading or parsing the credentials file or no GCP_PRIVATE_KEY provided: ${error.message}`,
    );
  }
  return privateKey;
}

// Function to create the keys object
function createKeysObject(privateKey) {
  return {
    type: "service_account",
    project_id: process.env.GCP_PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  };
}

export async function query({ query, values = [] }) {
  try {
    const privateKey = getPrivateKey();
    const keys = createKeysObject(privateKey);

    const auth = new GoogleAuth({
      credentials: keys,
      scopes: ["https://www.googleapis.com/auth/sqlservice.admin"],
    });

    const connector = new Connector({ auth });

    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.CLOUD_SQL_CONNECTION_NAME,
      ipType: "PUBLIC",
    });

    const pool = mysql.createPool({
      ...clientOpts,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [results] = await pool.execute(query, values);
    return results;
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw new Error(error.message);
  }
}
