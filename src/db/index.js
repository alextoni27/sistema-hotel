require('dotenv').config();
let postgresClient = null;
try {
  // try to use the `postgres` client if it's installed
  postgresClient = require('postgres');
} catch (e) {
  postgresClient = null;
}
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('ERROR: Define DATABASE_URL en .env');
  process.exit(1);
}

// If `postgres` is available, use it for convenience; otherwise use pg Pool only
const sql = postgresClient ? postgresClient(connectionString, { ssl: { rejectUnauthorized: false } }) : null;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function query(text, params) {
  if (sql && (!params || params.length === 0)) {
    const rows = await (sql.unsafe ? sql.unsafe(text) : sql(text));
    return { rows, rowCount: rows ? rows.length : 0 };
  }
  if (sql && params && params.length > 0) {
    const rows = await sql(text, ...params);
    return { rows, rowCount: rows ? rows.length : 0 };
  }
  const res = await pool.query(text, params);
  return { rows: res.rows, rowCount: res.rowCount };
}

module.exports = {
  query,
  sql,
  pool
};
