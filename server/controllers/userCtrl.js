const Users = require("../models/userModel");
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

      const user = await Users.findById(id)
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
      const user = await Users.find()
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
      } = req.body;
      let hashed;
      if (!username) {
        return res.status(400).json({ msg: "Please add your full name." });
      }
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
        { $match: { _id: { $nin: newArr } } },
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
};

module.exports = userCtrl;
