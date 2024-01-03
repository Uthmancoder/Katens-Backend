const express = require("express");
const router = express.Router();
const {
  GetAllCommentsForAllPosts,
  GetAllCommentsForPost,
  PostComment,
  AddReplyToComment,
  EditComment,
  DeleteComment,
} = require("../Controllers/CommentsController");

router.get("/allComments", GetAllCommentsForAllPosts);
//getting all comments for a single post
router.get("/allComments/:id", GetAllCommentsForPost);
router.post("/postComment", PostComment);
router.put("/editComment/:id", EditComment);
router.post("/postReply", AddReplyToComment),
router.delete("/deleteComment/:id", DeleteComment);

module.exports = router;
