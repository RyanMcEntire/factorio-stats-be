import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString,
});

export { pool };
