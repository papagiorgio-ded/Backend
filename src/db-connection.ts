import { Pool } from 'pg';




const pool = new Pool({
  user: 'pixel_trade_pg_user',
  password: 'i6MUaLjQY9KUAgv9kx1hzZziJanhyoCi',
  host: 'dpg-d8bcj0dckfvc73ct7prg-a.oregon-postgres.render.com',
  port: 5432,
  database: 'pixel_trade_pg',
  ssl: { rejectUnauthorized: false }
});

export function query(text: string, params?: any[]): any {
  return pool.query(text, params);
}
