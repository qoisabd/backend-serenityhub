const router = require("express").Router();
const multer = require("multer");

const controller = require("./controller");

router.post("/officer/unitwork", multer().none(), controller.addUnitWork);
router.delete("/officer/unitwork/:id", controller.deleteUnitWork);
router.get("/officer/unitwork", controller.getUnitWork);

module.exports = router;
