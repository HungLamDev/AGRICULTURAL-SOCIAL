const Users = require("../models/userModel");
const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
const Products = require("../models/productModel")
const bcrypt = require("bcrypt");
const userCtrl = {
  searchUser: async (req, res) => {
    try {
      console.log("Query parameters:", req.query);
      const { username } = req.query;
      const users = await Users.find({
        username: { $regex: username, $options: "i" },
      })
        .limit(10)
        .select("fullname username avatar");
      console.log("Found users:", users);
      if (users.length === 0) {
        return res.status(400).json({ msg: "User does not exist." });
      }
      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ msg: "ID is required" });

      const user = await Users.findOne({ _id: id, deleted_at: null })
        .select("-password")
        .populate("followers", "-password")
        .populate("following", "-password");
      if (!user) return res.status(400).json({ msg: "User not found" });

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const user = await Users.find({ deleted_at: null })
        .populate("following followers", "-password")
        .select("-password");
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  updateUser: async (req, res) => {
    try {
      console.log("Request Headers:", req.headers);
      console.log("Request Body:", req.body);
      console.log("Request Params:", req.params);
      console.log("User ID from auth middleware:", req.params.id);

      const {
        avatar,
        username,
        mobile,
        address,
        password,
        story,
        website,
        gender,
        role,
      } = req.body;
      let hashed;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        hashed = await bcrypt.hash(req.body.password, salt);
      }
      const updateData = {
        avatar,
        username,
        mobile,
        address,
        story,
        website,
        gender,
        role,
      };

      if (hashed) {
        updateData.password = hashed;
      }

      const updatedUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateData },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found." });
      }

      res.json({
        msg: "Update Success!",
      });
    } catch (err) {
      console.error("Error in updateUser:", err); // Log lỗi chi tiết
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Kiểm tra người dùng có tồn tại
      const user = await Users.findOne({ _id: userId, deleted_at: null });
      if (!user) {
        return res
          .status(404)
          .json({ msg: "User not found or already deleted." });
      }
      const count = await Users.countDocuments({ email: /userdelete\d+@gmail\.com/ });
      // Xóa mềm người dùng
      user.deleted_at = new Date();
      user.email = `userdelete${count + 1}@gmail.com`;
      await user.save();

      console.log('user bị xóa ', user.deleted_at);
      
      // Xóa mềm các bài viết của người dùng
      await Posts.updateMany(
        { user: userId, deleted_at: null },
        { $set: { deleted_at: new Date() } }
      );
  
      // Xóa mềm các bình luận của người dùng
      await Comments.updateMany(
        { user: userId, deleted_at: null },
        { $set: { deleted_at: new Date() } }
      );
      await Products.updateMany(
        { user: userId, deleted_at: null },
        { $set: { deleted_at: new Date() } }
      );
      
      return res.status(200).json({ msg: "Xóa thành công người dùng" });
    } catch (err) {
      console.error("Lỗi xóa người dùng:", err); // Log lỗi chi tiết
      return res.status(500).json({ msg: err.message });
    }
  },
  
  follow: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.params.id,
        followers: req.user._id,
      });
      if (user.length > 0)
        return res.status(500).json({ msg: "You followed this user." });

      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      ).populate({ path: "followers following", select: "-password" });

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      ).populate({ path: "followers following", select: "-password" });

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  suggestionsUser: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 10;

      const users = await Users.aggregate([
        { $match: { _id: { $nin: newArr }, deleted_at: null } },
        { $sample: { size: Number(num) } },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password");

      return res.json({
        users,
        result: users.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchUser: async (req, res) => {
    try {
      const searchQuery = req.query.username;

      const regex = new RegExp(searchQuery, "i");

      const users = await Users.find({
        username: { $regex: regex },
        deleted_at: { $exists: false },
      })
        .limit(5)
        .select("username avatar role");
      return res.json({ users });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = userCtrl;
