const router = require("express").Router();
const notifyController = require("../controllers/notifyController");
const auth = require("../middleware/auth");

router.post("/notify", auth, notifyController.createNotify);
router.delete("/notify/:id", auth, notifyController.removeNotify);
router.get("/notify", auth, notifyController.getNotifies);
router.put("/notify/isReadNotify/:id", auth, notifyController.isReadNotify);
router.delete("/notify", auth, notifyController.deleteAllNotifies);

module.exports = router;
