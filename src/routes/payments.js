const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentsController');
const { ensureAuthenticated } = require('../middlewares/auth');

router.get('/', ensureAuthenticated, controller.list);
router.get('/new', ensureAuthenticated, controller.newForm);
router.post('/', ensureAuthenticated, controller.create);
router.post('/:id/pay', ensureAuthenticated, controller.markPaid);

module.exports = router;
