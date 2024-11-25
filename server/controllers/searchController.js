const User = require("../models/userModel");
const Post = require("../models/postModel");

const searchController = {
  search: async (req, res) => {
    try {
      const searchQuery = req.query.search?.trim();
      console.log("Search Query:", searchQuery);
      if (!searchQuery) {
        return res
          .status(400)
          .json({ msg: "Vui lòng nhập từ khóa tìm kiếm hợp lệ!" });
      }

      const regex = new RegExp(searchQuery, "i");
      console.log("Regex:", regex);
      const users = await User.find({
        username: { $regex: regex },
        deleted_at: null,
      })
        .limit(5)
        .select("username avatar roles");
      console.log("Users found:", users);
      const posts = await Post.find({
        $or: [{ desc: { $regex: regex } }, { hashtag: { $regex: regex } }],
      }).limit(5);
      console.log("Posts found:", posts);

      return res.json({ users, posts });
    } catch (err) {
      console.error("Search Error:", err.message);
      return res.status(500).json({ msg: "Đã xảy ra lỗi khi tìm kiếm!" });
    }
  },
};

module.exports = searchController;
