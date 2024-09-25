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
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("user like", " -password")
        .populate({
          path: "comments",
          populate: { path: "user likes", select: "-password" },
        });
      return res.status(200).json({
        post,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Post.find({ _id: req.params.id, like: req.user._id });
      console.log("Post ID:", req.params.id);
      console.log("User ID:", req.user._id);
      if (post.length > 0)
        return res.status(403).json({ msg: "Bạn đã thích bài viết nảy rồi !" });
      const updatedPost = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { like: req.user._id },
        },
        { new: true }
      );

      res.json({ msg: "Bạn vừa thích bài viết này !", post: updatedPost });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unlikePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { like: req.user._id },
        },
        { new: true }
      );
      res.json({ msg: "Bạn đã bỏ thích bài viết này !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserPost: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.params.id }).sort("-createdAt");
      return res.status(200).json({ posts, result: posts.length });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = postCtrl;
