const router = require("express").Router();
const auth = require("../middleware/auth");
const commentController = require("../controllers/commentController");

//create comment
router.post("/comment", auth, commentController.createComment);
router.put("/comment/:id", auth, commentController.updateComment);
router.put("/comment/:id/like", auth, commentController.likeComment);
router.put("/comment/:id/unlike", auth, commentController.unlikeComment);
router.delete("/comment/:id", auth, commentController.deleteComment);

module.exports = router;
