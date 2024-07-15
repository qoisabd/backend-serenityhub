const router = require('express').Router();
const multer = require('multer');
const commentController = require('./controller');

router.post('/comment/:id', multer().none(), commentController.addComment);
router.delete('/comment/:id', commentController.deleteComment);

module.exports = router;
