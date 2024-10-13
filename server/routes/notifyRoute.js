const router = require("express").Router();
const notifyController = require("../controllers/notifyController");
const auth = require("../middleware/auth");

router.post("/notify", auth, notifyController.createNotify);
router.delete("/notify/:id", auth, notifyController.removeNotify);
router.get("/notify", auth, notifyController.getNotifies);

module.exports = router;
