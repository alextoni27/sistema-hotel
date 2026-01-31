const db = require('../db');

module.exports = {
  list: async (req, res) => {
    const result = await db.query('SELECT r.*, h.name as house, f.number as floor, rt.name as type FROM public.room r JOIN public.house h ON r.house_id=h.id JOIN public.floor f ON r.floor_id=f.id JOIN public.room_type rt ON r.room_type_id=rt.id ORDER BY h.id, f.number, r.number');
    res.render('rooms/list', { rooms: result.rows });
  },

  newForm: async (req, res) => {
    const houses = await db.query('SELECT * FROM public.house');
    const types = await db.query('SELECT * FROM public.room_type');
    res.render('rooms/new', { houses: houses.rows, types: types.rows });
  },

  floorsByHouse: async (req, res) => {
    const houseId = req.params.houseId;
    const result = await db.query('SELECT id, number FROM public.floor WHERE house_id = $1 ORDER BY number', [houseId]);
    res.json(result.rows);
  },

  create: async (req, res) => {
    const { house_id, floor_id, number, code, room_type_id, area_m2 } = req.body;
    await db.query('INSERT INTO public.room(house_id,floor_id,number,code,room_type_id,area_m2) VALUES($1,$2,$3,$4,$5,$6)', [house_id, floor_id, number, code, room_type_id, area_m2 || null]);
    res.redirect('/rooms');
  },

  show: async (req, res) => {
    const id = req.params.id;
    const r = await db.query('SELECT r.*, h.name as house, f.number as floor, rt.name as type FROM public.room r JOIN public.house h ON r.house_id=h.id JOIN public.floor f ON r.floor_id=f.id JOIN public.room_type rt ON r.room_type_id=rt.id WHERE r.id=$1', [id]);
    if (!r.rows.length) return res.status(404).send('No encontrado');
    res.render('rooms/show', { room: r.rows[0] });
  },

  editForm: async (req, res) => {
    const id = req.params.id;
    const result = await db.query('SELECT r.*, h.name as house, f.number as floor, rt.name as type FROM public.room r JOIN public.house h ON r.house_id=h.id JOIN public.floor f ON r.floor_id=f.id JOIN public.room_type rt ON r.room_type_id=rt.id WHERE r.id=$1', [id]);
    if (!result.rows.length) return res.redirect('/rooms');
    res.render('rooms/edit', { room: result.rows[0] });
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { house, floor, number, type, status } = req.body;
    await db.query('UPDATE public.room SET number=$1, status=$2 WHERE id=$3', [number, status, id]);
    res.redirect('/rooms');
  },

  remove: async (req, res) => {
    const id = req.params.id;
    await db.query('DELETE FROM public.room WHERE id=$1', [id]);
    res.redirect('/rooms');
  }
};
