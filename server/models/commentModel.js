const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tag: Object,
    reply: mongoose.Schema.Types.ObjectId,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    postId: mongoose.Schema.Types.ObjectId,
    postUserId: mongoose.Schema.Types.ObjectId,
    deleted_at: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comments", commentSchema);
