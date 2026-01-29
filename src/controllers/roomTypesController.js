const db = require('../db');

module.exports = {
  list: async (req, res) => {
    const result = await db.query('SELECT * FROM public.room_type ORDER BY id');
    res.render('room_types/list', { types: result.rows });
  },

  newForm: async (req, res) => {
    res.render('room_types/new');
  },

  create: async (req, res) => {
    const { code, name, base_price } = req.body;
    await db.query('INSERT INTO public.room_type(code,name,base_price) VALUES($1,$2,$3)', [code, name, base_price || 0]);
    res.redirect('/room_types');
  },

  show: async (req, res) => {
    const id = req.params.id;
    const t = await db.query('SELECT * FROM public.room_type WHERE id=$1', [id]);
    if (!t.rows.length) return res.status(404).send('No encontrado');
    res.render('room_types/show', { type: t.rows[0] });
  }
};
