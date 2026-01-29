const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const q = await db.query('SELECT id, email, password_hash, full_name FROM public.users WHERE email=$1', [email]);
  if (!q.rows.length) return res.render('auth/login', { error: 'Usuario o contraseña inválidos' });
  const user = q.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.render('auth/login', { error: 'Usuario o contraseña inválidos' });
  // guardar en sesión
  req.session.user = { id: user.id, email: user.email, full_name: user.full_name };
  // actualizar last_login
  await db.query('UPDATE public.users SET last_login=now() WHERE id=$1', [user.id]);
  res.redirect('/');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
});

module.exports = router;
