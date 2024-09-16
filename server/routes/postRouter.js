const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");

router.post("/post", postCtrl.createPost);

module.exports = router;
