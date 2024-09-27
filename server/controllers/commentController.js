const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

const commentController = {
  createComment: async (req, res) => {
    try {
      const { postId, content, tag, reply, postUserId } = req.body;
      const post = await Post.findById(postId);
      if (!post)
        return res.status(400).json({ msg: "Bài viết không tồn tại !" });

      if (reply) {
        const cm = await Comment.findById(reply);
        if (!cm)
          return res.status(400).json({ msg: "Bình luận không tồn tại !" });
      }

      console.log({ postId, content, tag, reply, postUserId });
      const newComment = new Comment({
        user: req.user._id,
        content,
        tag,
        reply,
        postId,
        postUserId,
      });

      await Post.findByIdAndUpdate(
        { _id: postId },
        { $push: { comments: newComment._id } },
        { new: true }
      );
      await newComment.save();
      return res.status(200).json({ newComment });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = commentController;
