

const { Router } = require('express');
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', authMiddleware, UserController.getAll);
router.get('/:id', authMiddleware, UserController.getById);
router.post('/', UserController.create);
router.put('/:id', authMiddleware, UserController.update);
router.delete('/:id', authMiddleware, UserController.remove);

module.exports = router;