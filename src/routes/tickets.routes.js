const { Router } = require('express');
const ticketsController = require('../controllers/tickets.controller');

const router = Router();

router.get('/', ticketsController.index);
router.get('/:id', ticketsController.show);
router.get('/:id/summary', ticketsController.summary);
router.post('/', ticketsController.store);
router.patch('/:id', ticketsController.update);
router.post('/:id/comments', ticketsController.addComment);

module.exports = router;
