const { Router } = require('express');
const ProductController = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

router.post('/', auth, ProductController.create);  
router.put('/:id', auth, ProductController.update);
router.delete('/:id', auth, ProductController.remove);

module.exports = router;