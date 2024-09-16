const Post = require("../models/postModel");
const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { desc, img, hashtag } = req.body;
      const newPost = new Post({ hashtag, desc, img, user: req.params._id });
      await newPost.save();
      return res.status(200).json({
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
        msg: "Tạo bài viết mới thành công !",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = postCtrl;
