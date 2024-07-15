const router = require('express').Router();
const multer = require('multer');
const controller = require('./controller');

router.post('/officer/category', multer().none(), controller.addCategory);
router.get('/category', controller.getCategory);
router.delete('/officer/category/:id', controller.deleteCategory);

module.exports = router;
