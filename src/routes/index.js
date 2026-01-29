const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const rooms = await db.query('SELECT r.id, h.name as house, f.number as floor, r.number as room_number, r.status, rt.name as type FROM public.room r JOIN public.house h ON r.house_id=h.id JOIN public.floor f ON r.floor_id=f.id JOIN public.room_type rt ON r.room_type_id=rt.id ORDER BY h.id, f.number, r.number LIMIT 20');
    res.render('index', { rooms: rooms.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

module.exports = router;
