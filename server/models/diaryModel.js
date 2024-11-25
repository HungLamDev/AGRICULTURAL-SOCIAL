const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    text: String,
    media: Array,
    deleted_at: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("diary", diarySchema);
