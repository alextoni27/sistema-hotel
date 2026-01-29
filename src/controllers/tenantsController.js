const db = require('../db');

module.exports = {
  list: async (req, res) => {
    const result = await db.query('SELECT * FROM public.tenant ORDER BY id');
    res.render('tenants/list', { tenants: result.rows });
  },

  newForm: (req, res) => res.render('tenants/new'),

  create: async (req, res) => {
    const { full_name, document, phone, email } = req.body;
    await db.query('INSERT INTO public.tenant(full_name,document,phone,email) VALUES($1,$2,$3,$4)', [full_name, document, phone, email]);
    res.redirect('/tenants');
  },

  editForm: async (req, res) => {
    const id = req.params.id;
    const result = await db.query('SELECT * FROM public.tenant WHERE id=$1', [id]);
    if (!result.rows.length) return res.redirect('/tenants');
    res.render('tenants/edit', { tenant: result.rows[0] });
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { full_name, phone, email } = req.body;
    await db.query('UPDATE public.tenant SET full_name=$1, phone=$2, email=$3 WHERE id=$4', [full_name, phone, email, id]);
    res.redirect('/tenants');
  },

  remove: async (req, res) => {
    const id = req.params.id;
    await db.query('DELETE FROM public.tenant WHERE id=$1', [id]);
    res.redirect('/tenants');
  }
};
