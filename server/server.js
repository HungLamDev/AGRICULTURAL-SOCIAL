require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const socketIO = require("socket.io");
const { ExpressPeerServer } = require("peer"); // Sử dụng ExpressPeerServer

const SocketServer = require("./socketSever");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.set("strictQuery", false);
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(process.env.MONGODB_URL, mongoOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Tạo server HTTP chung cho Express và Socket.IO
const server = require("http").createServer(app);

// Cấu hình Socket.IO
const io = socketIO(server, {
  cors: {
    origin: "https://agricultural-social-1.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  SocketServer(socket);
  console.log(`${socket.id} đã kết nối`);

  socket.on("disconnect", () => {
    console.log(`${socket.id} đã ngắt kết nối`);
  });
});

// Tích hợp PeerJS vào cùng server với Express
const peerServer = ExpressPeerServer(server, {
  path: "/", // Đặt path nếu cần
});
app.use("/peerjs", peerServer); // Sử dụng `/peerjs` làm endpoint cho PeerJS

// Định tuyến
app.use("/api", require("./routes/postRouter"));
app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/searchRoute"));
app.use("/api", require("./routes/commentRoute"));
app.use("/api", require("./routes/diaryRoute"));
app.use("/api", require("./routes/notifyRoute"));
app.use("/api", require("./routes/reportRoute"));
app.use("/api", require("./routes/messageRouter"));
app.use("/api", require("./routes/productRoute"));

app.get("/", (req, res) => {
  res.send("Welcome to AgricultureVN Web");
});

// Khởi động server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Server is running on port", port);
});
