import { pool } from './pool.js';

export async function updateGameStats(stats: any) {
  const query = `
    INSERT INTO game_stats (id, stats)
    VALUES (1, $1::jsonb)
    ON CONFLICT (id)
    DO UPDATE SET stats = $1::jsonb;
`;
  try {
    await pool.query(query, [stats]);
    console.log('Game stats database updated successfully');
  } catch (error) {
    console.error('Error adding stats to database: ', error);
  }
}
