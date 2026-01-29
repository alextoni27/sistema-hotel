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
  },

  editForm: async (req, res) => {
    const id = req.params.id;
    const result = await db.query('SELECT * FROM public.house WHERE id=$1', [id]);
    if (!result.rows.length) return res.redirect('/houses');
    res.render('houses/edit', { house: result.rows[0] });
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { name, address } = req.body;
    await db.query('UPDATE public.house SET name=$1, address=$2 WHERE id=$3', [name, address, id]);
    res.redirect('/houses');
  },

  remove: async (req, res) => {
    const id = req.params.id;
    await db.query('DELETE FROM public.house WHERE id=$1', [id]);
    res.redirect('/houses');
  }
};
