const db = require('../db');

module.exports = {
  list: async (req, res) => {
    const result = await db.query('SELECT * FROM public.house ORDER BY id');
    res.render('houses/list', { houses: result.rows });
  },

  newForm: async (req, res) => {
    res.render('houses/new');
  },

  create: async (req, res) => {
    const { name, address } = req.body;
    await db.query('INSERT INTO public.house(name,address) VALUES($1,$2)', [name, address || null]);
    res.redirect('/houses');
  },

  show: async (req, res) => {
    const id = req.params.id;
    const h = await db.query('SELECT * FROM public.house WHERE id=$1', [id]);
    if (!h.rows.length) return res.status(404).send('No encontrado');
    res.render('houses/show', { house: h.rows[0] });
  }
};
