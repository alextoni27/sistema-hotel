const db = require('../db');
const bcrypt = require('bcrypt');

module.exports = {
  list: async (req, res) => {
    const result = await db.query('SELECT id, email, full_name, role, status, created_at FROM public.users ORDER BY id');
    res.render('users/list', { users: result.rows });
  },

  newForm: (req, res) => {
    res.render('users/new');
  },

  create: async (req, res) => {
    const { email, password, full_name, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO public.users(email,password_hash,full_name,role) VALUES($1,$2,$3,$4)', [email, hash, full_name || null, role || 'admin']);
    res.redirect('/users');
  },

  show: async (req, res) => {
    const id = req.params.id;
    const result = await db.query('SELECT id, email, full_name, role, status, last_login, created_at FROM public.users WHERE id=$1', [id]);
    if (!result.rows.length) return res.status(404).send('Usuario no encontrado');
    res.render('users/show', { user: result.rows[0] });
  },

  editForm: async (req, res) => {
    const id = req.params.id;
    const result = await db.query('SELECT id, email, full_name, role, status FROM public.users WHERE id=$1', [id]);
    if (!result.rows.length) return res.redirect('/users');
    res.render('users/edit', { user: result.rows[0] });
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { email, full_name, role, status } = req.body;
    await db.query('UPDATE public.users SET email=$1, full_name=$2, role=$3, status=$4 WHERE id=$5', [email, full_name, role, status, id]);
    res.redirect('/users');
  },

  remove: async (req, res) => {
    const id = req.params.id;
    await db.query('DELETE FROM public.users WHERE id=$1', [id]);
    res.redirect('/users');
  }
};
