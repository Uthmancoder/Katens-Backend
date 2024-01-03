const mongoose = require("mongoose");

// Subdocument schema for replies
const ReplySchema = new mongoose.Schema(
  {
    CommentAuthor: { type: String, required: true, trim: true }, // Person who posted the reply
    replyContent: { type: String, required: true, trim: true }, // The reply text
    CommentAuthorImage: { type: String, required: true, trim: true }, // The image Person who posted the reply
    commentedPostId: { type: String, required: true, trim: true }, // The Id of the commnt repliet to
  },
  { timestamps: true }
);

// Main Comment schema
const CommentSchema = new mongoose.Schema(
  {
    CommentAuthor: { type: String, required: true, trim: true },
    CommentAuthorImage: { type: String, required: true, trim: true },
    CommentPosted: { type: String, required: true, trim: true },
    Email: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "Email already in use"],
    },
    commentedPostId: { type: String, required: true, trim: true },
    Replies: [ReplySchema], // Array of reply subdocuments
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = { CommentModel };
