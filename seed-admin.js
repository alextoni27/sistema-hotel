require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

(async () => {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error('ERROR: define DATABASE_URL en .env');
    process.exit(1);
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ejemplo.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
  const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrador';

  const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

  try {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await pool.query(
      `INSERT INTO public.users(email, password_hash, full_name, role, status)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         role = EXCLUDED.role,
         status = EXCLUDED.status`,
      [ADMIN_EMAIL, hash, ADMIN_NAME, 'admin', 'active']
    );

    console.log(`Usuario admin creado/actualizado: ${ADMIN_EMAIL}`);
  } catch (err) {
    console.error('Error creando admin:', err.message || err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
