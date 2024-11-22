require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const { ExpressPeerServer } = require("peer");
const app = express();
const path = require("path");
const SocketServer = require("./socketSever");
// CORS configuration
const allowedOrigins = [
  "https://5b37-2001-ee0-533d-d500-fd22-23e-773f-1271.ngrok-free.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  },
});

// Socket.IO connection
io.on("connection", (socket) => {
  SocketServer(socket);
  console.log(`${socket.id} Connected`);

  socket.on("disconnect", () => {
    console.log(`${socket.id} Disconnected`);
  });

  socket.on("sendMessage", (data) => {
    const { sender, recipient, text, media } = data;
    socket.to(recipient).emit("sendMessage", { sender, text, media });
  });
});

// MongoDB connection
mongoose.set("strictQuery", false);
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
ExpressPeerServer(server, { path: "/" });

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
mongoose
  .connect(process.env.MONGODB_URL, mongoOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define routes (add your routes as needed)
app.get("/", (req, res) => {
  res.send("Welcome to AgricultureVN Web");
});

// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log("Server is running on port", port);
});
