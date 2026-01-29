const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentsController');
const { ensureAuthenticated } = require('../middlewares/auth');

router.get('/', ensureAuthenticated, controller.list);
router.get('/new', ensureAuthenticated, controller.newForm);
router.post('/', ensureAuthenticated, controller.create);

router.post('/:id/pay', ensureAuthenticated, controller.markPaid);
router.get('/:id/edit', ensureAuthenticated, controller.editForm);
router.put('/:id', ensureAuthenticated, controller.update);
router.delete('/:id', ensureAuthenticated, controller.remove);

module.exports = router;
