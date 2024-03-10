[Figma](<https://www.figma.com/file/L7zU6i0MpJQ9uEIJJYo3iN/Barbell-Byte-(Copy)?type=design&node-id=2%3A151&mode=design&t=whOCyVEIGAljufiJ-1>)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Setting Up MySQL on Google Cloud

### Step 1: Create Cloud SQL Instance

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **SQL** and create a new instance.
3. Choose **MySQL** as the database engine and follow the prompts to set up your instance.
4. Once the instance is created (May take a few minutes), look at the overview section and remember the instance's public IP address for future reference!

### Step 2: Configuring SSL Certificates

1. In the SQL instance details page, go to the **Connections** tab.
2. Enable **Require SSL** for your instance to enhance security.
3. Under **SSL** settings, create a new SSL certificate. Download the following three files:
   - `server-ca.pem`: The server's CA certificate
   - `client-cert.pem`: The client certificate
   - `client-key.pem`: The client key
4. Store these files somewhere your application can access them, BUT don't let them be accessible by anyone else!

### Step 3: Creating the `usapl` Database (You can name is whatever else)

1. Go to the [Instances](https://console.cloud.google.com/sql/instances)
2. Click on your SQL instance that you've created earlier
3. Navigate to `Databases`
4. `CREATE DATABASE` and create a name for your database
