const router = require("express").Router();
const reportController = require("../controllers/reportController");
const auth = require("../middleware/auth");

router.post("/report", auth, reportController.createReport);

router.get("/report", auth, reportController.getReport);

router.put("/report/:id", auth, reportController.updateReport);

router.delete("/report/:id", auth, reportController.deleteReport);

module.exports = router;
