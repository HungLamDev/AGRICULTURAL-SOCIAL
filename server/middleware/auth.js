const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log("Received token:", token);

    if (!token) return res.status(400).json({ msg: "Invalid Authentication." });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decoded);

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(400).json({ msg: "Invalid User ID format." });
    }

    const user = await Users.findOne({ _id: decoded.id });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
