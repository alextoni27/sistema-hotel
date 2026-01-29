const express = require('express');
const router = express.Router();
const controller = require('../controllers/floorsController');
const { ensureAuthenticated } = require('../middlewares/auth');

router.get('/', ensureAuthenticated, controller.list);
router.get('/new', ensureAuthenticated, controller.newForm);
router.post('/', ensureAuthenticated, controller.create);

router.get('/:id', ensureAuthenticated, controller.show);
router.get('/:id/edit', ensureAuthenticated, controller.editForm);
router.put('/:id', ensureAuthenticated, controller.update);
router.delete('/:id', ensureAuthenticated, controller.remove);

module.exports = router;
