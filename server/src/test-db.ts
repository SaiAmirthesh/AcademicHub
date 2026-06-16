import pg from "pg";
const { Client } = pg;
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Connecting to database...");
  const start = Date.now();
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    console.log("Client connected. Querying...");
    const res = await client.query("SELECT NOW()");
    console.log("Result:", res.rows[0]);
    console.log(`Time taken: ${Date.now() - start}ms`);
    await client.end();
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}
main();
