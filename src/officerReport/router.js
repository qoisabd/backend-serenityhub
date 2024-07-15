const router = require('express').Router();
const multer = require('multer');
const officerReportController = require('./controller');

router.post(
  '/officer/report/:id',
  multer().none(),
  officerReportController.addReport,
);

module.exports = router;
