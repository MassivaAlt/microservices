
const { Router } = require('express');
const ProductController = require('../controllers/product.controller');

const router = Router();

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.post('/', ProductController.create);
router.put('/:id', ProductController.update);
router.delete('/:id', ProductController.remove);

module.exports = router;
