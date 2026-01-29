const db = require('../db');

module.exports = {
  list: async (req, res) => {
    const q = `SELECT l.*, t.full_name as tenant_name, r.code as room_code, h.name as house FROM public.lease l JOIN public.tenant t ON l.tenant_id=t.id JOIN public.room r ON l.room_id=r.id JOIN public.house h ON r.house_id=h.id ORDER BY l.start_date DESC`;
    const result = await db.query(q);
    res.render('leases/list', { leases: result.rows });
  },

  newForm: async (req, res) => {
    const tenants = await db.query('SELECT * FROM public.tenant');
    const rooms = await db.query("SELECT r.*, h.name as house, f.number as floor FROM public.room r JOIN public.house h ON r.house_id=h.id JOIN public.floor f ON r.floor_id=f.id WHERE r.status='available'");
    res.render('leases/new', { tenants: tenants.rows, rooms: rooms.rows });
  },

  create: async (req, res) => {
    const { tenant_id, room_id, start_date, end_date, monthly_price, deposit } = req.body;
    await db.query('INSERT INTO public.lease(tenant_id,room_id,start_date,end_date,monthly_price,deposit) VALUES($1,$2,$3,$4,$5,$6)', [tenant_id, room_id, start_date, end_date || null, monthly_price, deposit || null]);
    await db.query("UPDATE public.room SET status='occupied' WHERE id=$1", [room_id]);
    res.redirect('/leases');
  },

  editForm: async (req, res) => {
    const id = req.params.id;
    const leaseQ = await db.query('SELECT * FROM public.lease WHERE id=$1', [id]);
    if (!leaseQ.rows.length) return res.redirect('/leases');
    const lease = leaseQ.rows[0];
    const tenants = await db.query('SELECT * FROM public.tenant');
    const rooms = await db.query("SELECT r.*, h.name as house, f.number as floor FROM public.room r JOIN public.house h ON r.house_id=h.id JOIN public.floor f ON r.floor_id=f.id");
    res.render('leases/edit', { lease, tenants: tenants.rows, rooms: rooms.rows });
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { tenant_id, room_id, start_date, end_date, monthly_price, deposit } = req.body;
    await db.query('UPDATE public.lease SET tenant_id=$1, room_id=$2, start_date=$3, end_date=$4, monthly_price=$5, deposit=$6 WHERE id=$7', [tenant_id, room_id, start_date, end_date || null, monthly_price, deposit || null, id]);
    res.redirect('/leases');
  },

  remove: async (req, res) => {
    const id = req.params.id;
    // Optionally, set room as available again
    const leaseQ = await db.query('SELECT room_id FROM public.lease WHERE id=$1', [id]);
    if (leaseQ.rows.length) {
      await db.query("UPDATE public.room SET status='available' WHERE id=$1", [leaseQ.rows[0].room_id]);
    }
    await db.query('DELETE FROM public.lease WHERE id=$1', [id]);
    res.redirect('/leases');
  }
};
