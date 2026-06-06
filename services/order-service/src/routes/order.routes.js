
const { Router } = require('express');
const OrderController = require('../controllers/order.controller');

const router = Router();

router.get('/', OrderController.getAll);
router.get('/:id', OrderController.getById);
router.post('/', OrderController.create);
router.put('/:id', OrderController.update);
router.delete('/:id', OrderController.remove);

module.exports = router;
