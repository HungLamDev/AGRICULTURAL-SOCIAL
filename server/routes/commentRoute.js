const router = require("express").Router();
const auth = require("../middleware/auth");
const commentController = require("../controllers/commentController");

//create comment
router.post("/comment", auth, commentController.createComment);

module.exports = router;
