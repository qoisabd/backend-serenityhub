const router = require('express').Router();
const multer = require('multer');
const userController = require('./controller');

router.get('/admin/officer', userController.getOfficer);
router.delete(
  '/admin/officer/:id',
  multer().none(),
  userController.deleteOfficer,
);

module.exports = router;
