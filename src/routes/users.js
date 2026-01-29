const express = require('express');
const router = express.Router();
const users = require('../controllers/usersController');
const { ensureAuthenticated } = require('../middlewares/auth');

router.get('/', ensureAuthenticated, users.list);
router.get('/new', ensureAuthenticated, users.newForm);
router.post('/', ensureAuthenticated, users.create);

router.get('/:id', ensureAuthenticated, users.show);
router.get('/:id/edit', ensureAuthenticated, users.editForm);
router.put('/:id', ensureAuthenticated, users.update);
router.delete('/:id', ensureAuthenticated, users.remove);

module.exports = router;
