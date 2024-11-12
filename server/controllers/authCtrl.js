const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const RefreshToken = require("../models/refreshTokenModel");
const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.admin,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.admin,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
};

const authCtrl = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const name = await User.findOne({ username: username });
      if (name)
        return res.status(400).json({ msg: "Tên đăng nhập đã được đăng ký!" });
      const user_email = await User.findOne({ email: email });
      if (user_email)
        return res.status(409).json({ msg: "Email này đã tồn tại!" });
      if (password.length < 6)
        return res
          .status(404)
          .json({ msg: "Mật khẩu phải có ít nhất 6 ký tự trở lên!" });
      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = new User({
        username: username,
        email: email,
        password: passwordHash,
        role: req.body.role,
      });
      const access_token = createAccessToken(newUser);
      const refresh_token = createRefreshToken(newUser);
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      await newUser.save();
      res.json({
        msg: "Đăng Ký Thành Công!",
        access_token,
        user: {
          id: newUser._id,
          username: username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: req.body.email }).populate(
        "followers following"
      );
      if (!user)
        return res.status(400).json({ msg: "Email này không tồn tại!" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Mật khẩu không chính xác!" });
      if (user && isMatch) {
        const access_token = createAccessToken(user);
        const refresh_token = createRefreshToken(user);
        console.log(refresh_token);
        const refreshTk = await RefreshToken.findOne({ userId: user.id });
        if (!refreshTk) {
          const newRefreshToken = await new RefreshToken({
            token: refresh_token,
            userId: user.id,
          });
          await newRefreshToken.save();
        } else {
          await RefreshToken.findOneAndUpdate({ token: refresh_token });
        }
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/api/refresh_token",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        });
        res.json({
          msg: "Đăng nhập Thành Công!",
          access_token,
          user: {
            ...user._doc,
            isAdmin: user.admin,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
      return res.json({ msg: "Đã đăng xuất!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  generateAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Vui lòng đăng nhập!" });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) return res.status(400).json({ msg: "Vui lòng đăng nhập!" });

          const user = await User.findById(result.id)
            .select("-password")
            .populate("followers following");
          if (!user) return res.status(400).json({ msg: "Không tồn tại!" });

          // Kiểm tra access token cũ nếu còn hiệu lực thì không tạo mới
          const access_token = req.headers.authorization?.split(" ")[1];
          if (access_token) {
            try {
              const decoded = jwt.verify(
                access_token,
                process.env.ACCESS_TOKEN_SECRET
              );
              if (decoded && decoded.exp * 1000 > Date.now()) {
                // Token vẫn còn hiệu lực, trả về token cũ
                return res.json({ access_token, user });
              }
            } catch (error) {
              // Token hết hạn hoặc không hợp lệ, tiếp tục tạo mới
            }
          }

          const new_access_token = createAccessToken({ id: result.id });

          res.json({
            access_token: new_access_token,
            user,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = authCtrl;
