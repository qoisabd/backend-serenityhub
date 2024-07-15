const router = require('express').Router();

const multer = require('multer');
const reportController = require('./controller');

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({ dest: 'public', fileFilter: imageFilter });

router.get('/report/:id', reportController.getDetailReport);
router.get('/report', reportController.getAllReport);
router.get('/report/my/:id', reportController.getReportByUser);

router.post('/report', upload.array('image', 3), reportController.addReport);
// officer
router.get('/officer/report/:id', reportController.getAllReportByUnitWorks);
router.get('/officer/report/my/:id', reportController.getAllReportByOfficer);
// admin
router.put(
  '/admin/report/assign/:id',
  multer().none(),
  reportController.assignReportToUnitWork,
);
router.get(
  '/admin/report/coordinates',
  reportController.getAllReportCoordinate,
);
router.delete(
  '/admin/report/delete/:id',
  multer().none(),
  reportController.deleteReport,
);

module.exports = router;
