const db = require('../db');

module.exports = {
  list: async (req, res) => {
    const result = await db.query('SELECT f.*, h.name as house_name FROM public.floor f JOIN public.house h ON f.house_id=h.id ORDER BY h.id, f.number');
    res.render('floors/list', { floors: result.rows });
  },

  newForm: async (req, res) => {
    const houses = await db.query('SELECT * FROM public.house');
    res.render('floors/new', { houses: houses.rows });
  },

  create: async (req, res) => {
    const { house_id, number, description } = req.body;
    await db.query('INSERT INTO public.floor(house_id,number,description) VALUES($1,$2,$3)', [house_id, number, description || null]);
    res.redirect('/floors');
  },

  show: async (req, res) => {
    const id = req.params.id;
    const f = await db.query('SELECT f.*, h.name as house_name FROM public.floor f JOIN public.house h ON f.house_id=h.id WHERE f.id=$1', [id]);
    if (!f.rows.length) return res.status(404).send('No encontrado');
    res.render('floors/show', { floor: f.rows[0] });
  }
};
