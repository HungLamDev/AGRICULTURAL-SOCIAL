require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const socketIO = require("socket.io");
const SocketServer = require("./socketSever");
const { PeerServer } = require("peer");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//socket
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000", // URL của client
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  SocketServer(socket);
  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    // Gửi lại message tới tất cả client
    io.emit("receiveMessage", data);
  });
  console.log(`${socket.id} Connected`);

  socket.on("disconnect", () => {
    console.log(`${socket.id} Disconnected`);
  });
});
// create peer server
PeerServer({
  secure: true,
  port: process.env.PEER_PORT || 3001,
  path: "/",
});

// Routes
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
mongoose.set("strictQuery", false);
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGODB_URL, mongoOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Server is running on port", port);
});
app.get("/", (req, res) => {
  res.send("Welcome to AgricultureVN Web");
});
