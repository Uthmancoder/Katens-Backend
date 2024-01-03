const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { CommentModel } = require("../Models/CommentModel");
const { PostModel } = require("../Models/PostModels");
const { UserModel } = require("../Models/UserModel");
// const { ObjectId } = mongoose.Types;

const GetAllCommentsForAllPosts = asyncHandler(async (req, res) => {
  try {
    // getting all Posts
    const allPosts = await PostModel.find();
    // declaring allComments array 
    const allComments = [];

    for (const post of allPosts) {
      const commentedPostId = post._id.toString();

      const commentsForPost = await CommentModel.find({
        commentedPostId: commentedPostId, 
      });

      // console.log("Comments for Post", commentedPostId, ":", commentsForPost);

      // Add an object with post ID and comments array to allComments
      allComments.push({
        postId: commentedPostId,
        comments: commentsForPost,
      });
    }

    res.status(200).json({ allComments });
  } catch (error) {
    console.error("Error in Getting all Comments For all Posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// getting all comments for each single post
const GetAllCommentsForPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  // console.log("Post Id: ", postId);  

  const allCommentsForPost = await CommentModel.find({
    commentedPostId: postId,
  });

  const formattedComments = allCommentsForPost.map((comment) => ({
    _id: comment._id,
    CommentAuthor: comment.CommentAuthor,
    CommentPosted: comment.CommentPosted,
    Email: comment.Email,
    Replies: comment.Replies,
    CommentAuthorImage: comment.CommentAuthorImage,
    commentedPostId: comment.commentedPostId,
    date: comment.createdAt.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));

  res.status(200).send({
    message: "All comments for a singlePost : ",
    comments: formattedComments,
  });
});

// Posting a comment
const PostComment = asyncHandler(async (req, res) => {
  const { Username, Email, PostContent, commentedPostId } = req.body;
  // console.log(req.body);
  if (!Username || !PostContent || !commentedPostId || !Email) {
    res.status(400);
    throw new Error("All Fields Are Required");
  }

  // console.log(req.body);
  const getUserDetails = await UserModel.findOne({ Email });
  // console.log("User details :", getUserDetails);
  if (!getUserDetails) {
    return res
      .status(404)
      .json({ message: "User not found, try signing up for a new account" });
  }

  const CommentAuthorImage = getUserDetails.Image;

  const getPost = await PostModel.findById(commentedPostId);
  console.log("Post details :", getPost);
  if (!getPost) {
    res.status(404);
    throw new Error("Post Not Found");
  }

  const PostComment = await CommentModel.create({
    CommentAuthor: Username,
    CommentPosted: PostContent,
    Email,
    CommentAuthorImage: CommentAuthorImage,
    commentedPostId,
  });

  res
    .status(200)
    .json({ message: "Post Commented on Successfully", PostComment });
});

// getting a single comment for replying to it
const AddReplyToComment = asyncHandler(async (req, res) => {
  const {Username,  replyContent, repliedCommentId } = req.body;

  if (!Username || !replyContent || !repliedCommentId) {
    res.status(400);
    throw new Error("All Fields Are Required");
  }

  const getUserDetails = await UserModel.findOne({ Username });

  if (!getUserDetails) {
    return res
      .status(404)
      .json({ message: "User not found, try signing up for a new account" });
  }

  const CommentAuthorImage = getUserDetails.Image;

  const replyDetails = {
    CommentAuthor: Username,
    CommentAuthorImage: CommentAuthorImage,
    replyContent: replyContent,
    commentedPostId: repliedCommentId,
  };

  const updatedComment = await CommentModel.findByIdAndUpdate(
    { repliedCommentId }, // Use the document ID as the first argument
    {
      $push: { Replies: replyDetails }, // Use $push to add a new element to the array
    },
    { new: true } // Return the updated document
  );

  if (!updatedComment) {
    res.status(404);
    throw new Error("No Comment Found for the specified Id");
  }

  res.status(200).json({
    message: `Added a reply to the comment with ID: ${repliedCommentId}`,
    updatedComment,
  });
});

// Editing a comment
const EditComment = asyncHandler(async (req, res) => {
  const GetComment = await CommentModel.findById(req.params.id);
  if (!GetComment) {
    res.status(404);
    throw new Error("No Comment Found for the specified Id");
  }

  const UpdateComment = await CommentModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json({
    message: `Comment Eitted Successfully for ${req.params.id}`,
    UpdateComment,
  });
});

const DeleteComment = asyncHandler(async (req, res) => {
  const GetComment = await CommentModel.findById(req.params.id);
  if (!GetComment) {
    res.status(404);
    throw new Error("No Comment Found for the specified Id");
  }

  const deleteComment = await CommentModel.findByIdAndRemove(req.params.id);
  res.status(200).json({
    message: `Comment Deleted Successfully for ${req.params.id}`,
    deleteComment,
  });
});

module.exports = {
  GetAllCommentsForAllPosts,
  GetAllCommentsForPost,
  AddReplyToComment,
  PostComment,
  EditComment,
  DeleteComment,
};
