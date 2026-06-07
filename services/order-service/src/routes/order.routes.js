
const { Router } = require('express');
const OrderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', authMiddleware, OrderController.getAll);
router.get('/:id', authMiddleware, OrderController.getById);
router.post('/', authMiddleware, OrderController.create);
router.put('/:id', authMiddleware, OrderController.update);
router.delete('/:id', authMiddleware, OrderController.remove);

module.exports = router;
