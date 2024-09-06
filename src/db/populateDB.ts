import { pool } from "./pool";

const setupDatabase = async () => {
  console.log("Starting database setup...");
  try {
    await pool.query("BEGIN");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_stats (
        id SERIAL PRIMARY KEY,
        stats JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS production_history (
        id SERIAL PRIMARY KEY,
        tick BIGINT NOT NULL,
        item VARCHAR(255) NOT NULL,
        amount INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS consumption_history (
        id SERIAL PRIMARY KEY,
        tick BIGINT NOT NULL,
        item VARCHAR(255) NOT NULL,
        amount INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS research_history (
        id SERIAL PRIMARY KEY,
        tick BIGINT NOT NULL,
        technology VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS mods_history (
        id SERIAL PRIMARY KEY,
        tick BIGINT NOT NULL,
        name VARCHAR(255) NOT NULL,
        version VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_production_history_tick ON production_history(tick);
      CREATE INDEX IF NOT EXISTS idx_consumption_history_tick ON consumption_history(tick);
      CREATE INDEX IF NOT EXISTS idx_research_history_tick ON research_history(tick);
      CREATE INDEX IF NOT EXISTS idx_mods_history_tick ON mods_history(tick);
    `);

    await pool.query("COMMIT");
    console.log("Database setup completed successfully.");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error setting up database:", error);
  }
};

setupDatabase().then(() => pool.end());
