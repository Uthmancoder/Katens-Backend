const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
  Author: { type: String, required: true, trim: true, unique: false },
  Title: { type: String, required: true, trim: true },
  PostContent: { type: String, required: true, trim: true },
  PostImage: { type: String, required: true, trim: true },
  Category: {
    type: String,
    required: true,
    enum: ["Celebration", "Culture", "Fashion", "Inspiration", "Lifestyle", "Politics", "Trending"],
    default: "Trending",
    trim: true,
  },
  AuthorImage: { type: String, required: true, trim: true },
  OtherImages: { type: Array, required: false, trim: true },
}, { timestamps: true });

const PostModel = mongoose.model("Post", PostSchema);

module.exports = { PostModel };