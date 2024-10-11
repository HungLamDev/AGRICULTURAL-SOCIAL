const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ msg: "Invalid Authentication header format." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(400).json({ msg: "Invalid User ID format." });
    }

    const user = await Users.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found." });
    req.user = user;
    next();
  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(500).json({ msg: "Internal Server Error." });
  }
};

module.exports = auth;
