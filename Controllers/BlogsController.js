const asyncHandler = require("express-async-handler");
const { PostModel } = require("../Models/PostModels");
const bcrypt = require("bcryptjs");
const { UserModel } = require("../Models/UserModel");
const { cloudinary, cloudinaryConfig } = require("../Config/CloudineryConfig");

// Using express error  handler middlewares to handle all errors instead of using try catch  so for using that you'd wrap al the asynchroinous function within the asyncHandler
const CreatePost = asyncHandler(async (req, res) => {
  const { Author, Title, PostContent, PostImage, Category, OtherImages } =
    req.body;
    console.log(req.body)

  if (!Author || !Title || !PostContent || !PostImage || !Category) {
    res.status(400);
    throw new Error("All Fields Are Required");
  }

  // Check if the author exists in the database
  const existingAuthor = await UserModel.findOne({ Username : Author });
  if (!existingAuthor) {
    res.status(400);
    throw new Error("Author does not exist");
  }

  const authorImage = existingAuthor.Image;

  // Upload OtherImages to Cloudinary
  const otherImagesUpload = await Promise.all(
    OtherImages.map(async (image) => {
      return cloudinary.uploader.upload(image, {
        folder: "other-images", // Optional: You can organize uploads into folders
      });
    })
  );

  // Upload the main PostImage to Cloudinary
  const mainImageUpload = await cloudinary.uploader.upload(PostImage, {
    folder: "post-images", // Optional: You can organize uploads into folders
  });

  // Creating the Post
  const createPost = await PostModel.create({
    Author,
    Title,
    PostContent,
    PostImage: mainImageUpload.secure_url,
    Category,
    AuthorImage: authorImage,
    OtherImages: otherImagesUpload.map((img) => img.secure_url),
  });

  res.status(200).send({ message: "Post Created Successfully", createPost });
});

// Getting all the available Posts from the database
const GetAllPost = asyncHandler(async (req, res) => {
  const Allposts = await PostModel.find();
  // Map the posts to include the formatted creation date
  const postsWithFormattedDates = Allposts.map((post) => ({
    _id: post._id,
    Author: post.Author,
    Title: post.Title,
    PostContent: post.PostContent,
    PostImage: post.PostImage,
    Category: post.Category,
    AuthorImage: post.AuthorImage,
    OtherImages: post.OtherImages,
    date: post.createdAt.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short", 
      day: "numeric",
    }),
  }));

  res.status(200).send({ message: "All Posts", Allposts: postsWithFormattedDates });
  console.log("All Posts", Allposts); 
});


const GetSinglePost = asyncHandler(async (req, res) => {
  const getContact = await PostModel.findById(req.params.id);
  if (!getContact) {
    res.status(404);
    throw new Error("Post Not Found");
  }
  res.status(200).send({
    message: `Getting  SinglePost post for ${req.params.id}`,
    getContact,
  });
});

const EditPost = asyncHandler(async (req, res) => {
  const GetPost = await PostModel.findById(req.params.id);
  if (!GetPost) {
    res.status(404);
    throw new Error("Post Not Found");
  }

  const UpdatePost = await PostModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json({
    message: `Post Editted Successfuly  for ${req.params.id}`,
    UpdatePost,
  });
});

const DeletePost = asyncHandler(async (req, res) => {
  const GetPost = await PostModel.findById(req.params.id);
  if (!GetPost) {
    res.status(404);
    throw new Error("Post Not Found");
  }
  const DeletedPost = await PostModel.findByIdAndRemove(req.params.id);
  res.status(200).json({
    message: `Post Deleted Successfully for ${req.params.id}, Here is the Post deleted :`,
    DeletedPost,
  });
});

module.exports = {
  CreatePost,
  GetAllPost,
  GetSinglePost,
  EditPost,
  DeletePost,
};
