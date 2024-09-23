const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");
const auth = require("../middleware/auth");

router.post("/post", auth, postCtrl.createPost);
router.get("/post", auth, postCtrl.getPosts);
router.patch("/post/:id", auth, postCtrl.updatePost);

module.exports = router;
