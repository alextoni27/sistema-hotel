const db = require('../db');

module.exports = {
  list: async (req, res) => {
    const q = `SELECT p.*, l.id as lease_id, t.full_name as tenant, r.code as room_code FROM public.payment p JOIN public.lease l ON p.lease_id=l.id JOIN public.tenant t ON l.tenant_id=t.id JOIN public.room r ON l.room_id=r.id ORDER BY p.period_start DESC`;
    const result = await db.query(q);
    res.render('payments/list', { payments: result.rows });
  },

  newForm: async (req, res) => {
    const leases = await db.query(`SELECT l.*, t.full_name as tenant, r.code as room_code FROM public.lease l JOIN public.tenant t ON l.tenant_id=t.id JOIN public.room r ON l.room_id=r.id WHERE l.status='active'`);
    res.render('payments/new', { leases: leases.rows });
  },

  create: async (req, res) => {
    const { lease_id, period_start, period_end, amount, method } = req.body;
    await db.query('INSERT INTO public.payment(lease_id,period_start,period_end,amount,method) VALUES($1,$2,$3,$4,$5)', [lease_id, period_start, period_end, amount, method]);
    res.redirect('/payments');
  },

  markPaid: async (req, res) => {
    const id = req.params.id;
    await db.query("UPDATE public.payment SET status='paid', paid_at=now() WHERE id=$1", [id]);
    res.redirect('/payments');
  }
};
