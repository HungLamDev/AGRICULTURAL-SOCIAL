require("dotenv").config();
const express = require("express");

const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", require("./routes/postRouter"));
app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/searchRoute"));
app.use("/api", require("./routes/commentRoute"));

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
app.listen(port, () => {
  console.log("Server is running on port", port);
});
