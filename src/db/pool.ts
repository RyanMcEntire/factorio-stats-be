import pg from "pg";
const { Pool } = pg;
// import dotenv from 'dotenv';

// dotenv.config();

const connectionString =
  "postgres://u34538_b6knqbofT9:wNTqyK91S8SFdK+exyoVYY+r@gameshil4.bisecthosting.com:5432/s34538_ServerStats";

const pool = new Pool({
  connectionString,
});

export { pool };
