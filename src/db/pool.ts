import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;

dotenv.config();

export const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || ""),
});
