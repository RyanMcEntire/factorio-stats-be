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
        surface VARCHAR(255) NOT NULL,
        tick BIGINT NOT NULL,
        item VARCHAR(255) NOT NULL,
        amount INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS consumption_history (
        id SERIAL PRIMARY KEY,
        surface VARCHAR(255) NOT NULL,
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

    await pool.query(`
      CREATE OR REPLACE VIEW complete_production_history_delta AS
      WITH all_production_combos AS (
          SELECT DISTINCT t.tick, i.item
          FROM (SELECT DISTINCT tick FROM production_history) t
          CROSS JOIN (SELECT DISTINCT item FROM production_history) i
      ),
      last_known_amounts AS (
          SELECT
              apc.tick,
              apc.item,
              (SELECT ph.amount
              FROM production_history ph
              WHERE ph.item = apc.item AND ph.tick <= apc.tick
              ORDER BY ph.tick DESC
              LIMIT 1) as last_amount
          FROM all_production_combos apc
      ),
      current_and_previous AS (
          SELECT
              lka.tick,
              lka.item,
              COALESCE(ph.amount, lka.last_amount) AS current_amount,
              LAG(COALESCE(ph.amount, lka.last_amount)) OVER (PARTITION BY lka.item ORDER BY lka.tick) AS previous_amount
          FROM last_known_amounts lka
          LEFT JOIN production_history ph ON lka.tick = ph.tick AND lka.item = ph.item
      ),
      delta_calculation AS (
          SELECT
              tick,
              item,
              COALESCE(current_amount - previous_amount, 0) AS delta_amount
          FROM current_and_previous
      ),
      items_with_changes AS (
          SELECT DISTINCT item
          FROM delta_calculation
          WHERE delta_amount > 0
      )
      SELECT dc.tick, dc.item, dc.delta_amount
      FROM delta_calculation dc
      INNER JOIN items_with_changes iwc ON dc.item = iwc.item
      ORDER BY dc.item, dc.tick;


    CREATE OR REPLACE VIEW complete_consumption_history_delta AS
    WITH all_consumption_combos AS (
        SELECT DISTINCT t.tick, i.item
        FROM (SELECT DISTINCT tick FROM consumption_history) t
        CROSS JOIN (SELECT DISTINCT item FROM consumption_history) i
    ),
    last_known_amounts AS (
        SELECT
            acc.tick,
            acc.item,
            (SELECT ch.amount
            FROM consumption_history ch
            WHERE ch.item = acc.item AND ch.tick <= acc.tick
            ORDER BY ch.tick DESC
            LIMIT 1) as last_amount
        FROM all_consumption_combos acc
    ),
    current_and_previous AS (
        SELECT
            lka.tick,
            lka.item,
            COALESCE(ch.amount, lka.last_amount) AS current_amount,
            LAG(COALESCE(ch.amount, lka.last_amount)) OVER (PARTITION BY lka.item ORDER BY lka.tick) AS previous_amount
        FROM last_known_amounts lka
        LEFT JOIN consumption_history ch ON lka.tick = ch.tick AND lka.item = ch.item
    ),
    delta_calculation AS (
        SELECT
            tick,
            item,
            COALESCE(current_amount - previous_amount, 0) AS delta_amount
        FROM current_and_previous
    ),
    items_with_changes AS (
        SELECT DISTINCT item
        FROM delta_calculation
        WHERE delta_amount > 0
    )
    SELECT dc.tick, dc.item, dc.delta_amount
    FROM delta_calculation dc
    INNER JOIN items_with_changes iwc ON dc.item = iwc.item
    ORDER BY dc.item, dc.tick;
    `);

    await pool.query("COMMIT");
    console.log("Database setup completed successfully.");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error setting up database:", error);
  }
};

setupDatabase().then(() => pool.end());
