const db = require('../db');

module.exports = {
  list: async (req, res) => {
    // Traer todos los pagos individuales
    const pagosQ = `SELECT p.*, l.id as lease_id, t.full_name as tenant, r.code as room_code, l.monthly_price
      FROM public.payment p
      JOIN public.lease l ON p.lease_id=l.id
      JOIN public.tenant t ON l.tenant_id=t.id
      JOIN public.room r ON l.room_id=r.id
      ORDER BY p.period_start DESC, p.paid_at ASC`;
    const pagos = await db.query(pagosQ);

    // Agrupar pagos por lease y periodo para resumen
    const resumen = {};
    pagos.rows.forEach(p => {
      const key = `${p.lease_id}_${p.period_start}_${p.period_end}`;
      if (!resumen[key]) {
        resumen[key] = {
          lease_id: p.lease_id,
          tenant: p.tenant,
          room_code: p.room_code,
          period_start: p.period_start,
          period_end: p.period_end,
          monthly_price: p.monthly_price,
          total_pagado: 0,
          pagos: [],
        };
      }
      resumen[key].total_pagado += Number(p.amount);
      resumen[key].pagos.push(p);
    });
    const resumenArr = Object.values(resumen);
    res.render('payments/list', { pagos: pagos.rows, resumen: resumenArr });
  },

  newForm: async (req, res) => {
    // Traer leases activos
    const leases = await db.query(`SELECT l.*, t.full_name as tenant, r.code as room_code FROM public.lease l JOIN public.tenant t ON l.tenant_id=t.id JOIN public.room r ON l.room_id=r.id WHERE l.status='active'`);
    res.render('payments/new', { leases: leases.rows });
  },

  create: async (req, res) => {
    const { lease_id, period_start, period_end, amount, method } = req.body;
    // Validar que el periodo no esté ya pagado
    const pagos = await db.query('SELECT SUM(amount) as total_pagado, MAX(status) as max_status FROM public.payment WHERE lease_id=$1 AND period_start=$2 AND period_end=$3', [lease_id, period_start, period_end]);
    // Obtener el precio mensual del contrato
    const leaseQ = await db.query('SELECT monthly_price FROM public.lease WHERE id=$1', [lease_id]);
    const monthly_price = leaseQ.rows.length ? Number(leaseQ.rows[0].monthly_price) : 0;
    const total_pagado = pagos.rows[0] && pagos.rows[0].total_pagado ? Number(pagos.rows[0].total_pagado) : 0;
    const status = pagos.rows[0] && pagos.rows[0].max_status;
    if (status === 'paid' || total_pagado >= monthly_price) {
      return res.status(400).send('Este periodo ya está completamente pagado.');
    }
    await db.query('INSERT INTO public.payment(lease_id,period_start,period_end,amount,method) VALUES($1,$2,$3,$4,$5)', [lease_id, period_start, period_end, amount, method]);
    res.redirect('/payments');
  },

  markPaid: async (req, res) => {
    const id = req.params.id;
    await db.query("UPDATE public.payment SET status='paid', paid_at=now() WHERE id=$1", [id]);
    res.redirect('/payments');
  },

  editForm: async (req, res) => {
    const id = req.params.id;
    const result = await db.query('SELECT p.*, l.id as lease_id, t.full_name as tenant, r.code as room_code FROM public.payment p JOIN public.lease l ON p.lease_id=l.id JOIN public.tenant t ON l.tenant_id=t.id JOIN public.room r ON l.room_id=r.id WHERE p.id=$1', [id]);
    if (!result.rows.length) return res.redirect('/payments');
    res.render('payments/edit', { payment: result.rows[0] });
  },

  update: async (req, res) => {
    const id = req.params.id;
    const { amount, period_start, period_end, status } = req.body;
    await db.query('UPDATE public.payment SET amount=$1, period_start=$2, period_end=$3, status=$4 WHERE id=$5', [amount, period_start, period_end, status, id]);
    res.redirect('/payments');
  },

  remove: async (req, res) => {
    const id = req.params.id;
    await db.query('DELETE FROM public.payment WHERE id=$1', [id]);
    res.redirect('/payments');
  }
};
