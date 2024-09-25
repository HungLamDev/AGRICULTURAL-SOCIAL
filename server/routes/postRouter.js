const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");
const auth = require("../middleware/auth");

router.post("/post", auth, postCtrl.createPost);
router.get("/post", auth, postCtrl.getPosts);
router.get("/post/:id", auth, postCtrl.getPost);
router.patch("/post/:id", auth, postCtrl.updatePost);
router.put("/post/:id/like", auth, postCtrl.likePost);

router.put("/post/:id/unlike", auth, postCtrl.unlikePost);
//get user post
router.get("/post/user_posts/:id", auth, postCtrl.getUserPost);
module.exports = router;
