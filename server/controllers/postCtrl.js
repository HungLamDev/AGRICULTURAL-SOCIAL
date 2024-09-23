const Post = require("../models/postModel");
const Comments = require("../models/commentModel");
const User = require("../models/userModel");
const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { desc, img, hashtag } = req.body;

      if (!req.user || !req.user._id) {
        return res.status(400).json({ msg: "User is not authenticated." });
      }
      const newPost = new Post({ hashtag, desc, img, user: req.user._id });

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
  getPosts: async (req, res) => {
    try {
      const followingUsers = [...req.user.following, req.user._id];
      const posts = await Post.find({
        user: { $in: followingUsers },
      }).populate("user like", "fullname username avatar ");
      return res.status(200).json({
        msg: "Lấy bài viết thành công!",
        result: posts.length,
        posts,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updatePost: async (req, res) => {
    try {
      const { hashtag, desc, img } = req.body;
      if (!req.user || !req.user._id) {
        return res.status(400).json({ msg: "User is not authenticated." });
      }
      const post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          desc,
          img,
          hashtag,
        }
      ).populate("user like", "avatar username followers");
      // .populate({
      //   path: "comments",
      //   populate: { path: "user likes", select: "-password" },
      // });
      return res.status(200).json({
        msg: "Cập nhật bài viết thành công !",
        newPost: {
          ...post._doc,
          desc,
          img,
          hashtag,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = postCtrl;
