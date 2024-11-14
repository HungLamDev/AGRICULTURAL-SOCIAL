const router = require("express").Router();
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/userCtrl");

// router.get("/search", auth, userCtrl.searchUser);

router.get("/user/:id", auth, userCtrl.getUser);
//get all user
router.get("/user", auth, userCtrl.getAllUsers);
router.patch("/user/:id", auth, userCtrl.updateUser);

router.patch("/user/:id/follow", auth, userCtrl.follow);
router.patch("/user/:id/unfollow", auth, userCtrl.unfollow);
router.get("/user/suggestionUser/result", auth, userCtrl.suggestionsUser);
router.delete("/user/:id", auth, userCtrl.deleteUser);
router.get("/user/search/result", auth, userCtrl.searchUser);

module.exports = router;
