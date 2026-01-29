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
  }
};
