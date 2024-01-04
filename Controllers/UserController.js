const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const { UserModel } = require("../Models/UserModel");
const { cloudinary, cloudinaryConfig } = require("../Config/CloudineryConfig");

const SignUp = asyncHandler(async (req, res) => {
  const { Username, Email, Password, Image } = req.body;

  // Check if all required fields are present
  if (!Username || !Email || !Password || !Image) {
    res.status(400);
    throw new Error("All Fields Are Required");
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ Email });

  if (existingUser) {
    res.status(400);
    throw new Error("User Already Exists, Try Signing In to your account");
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create a new user
    const newUser = await UserModel.create({
      Username,
      Email,
      Password: hashedPassword,
      Image: Image,
    });

    // Respond with a success message and non-sensitive user information
    res.status(201).send({
      message: "Signup Successful",
      user: {
        _id: newUser._id,
        Username: newUser.Username,
        Email: newUser.Email,
      },
    });
  } catch (error) {
    // Handle errors during the hashing or database operation
    console.error("Error creating user:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const Signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const verifyUser = await UserModel.findOne({ Email: email });
  if (!verifyUser) {
    res.status(400).send({ message: "Email does not exist" });
  }

  if (verifyUser) {
    // User already exists
    const isMatch = await bcrypt.compare(password, verifyUser.Password);

    if (isMatch) {
      // Existing user, send a success message and redirect to the dashboard
      res
        .status(200)
        .send({
          message: "Login Successful",
          Username: verifyUser.Username,
          status: "existing",
        });
    } else {
      res.status(400).send({ message: "Invalid Password" });
    }
  } else {
    // New user, send a notice to the client and redirect to the profile setup page
    res
      .status(200)
      .send({ message: "User Logged in successful", status: "new" });
  }
});

const SetUpProfile = asyncHandler(async (req, res) => {
  const { userImage, email } = req.body;
  try {
    // Upload userImage to Cloudinary
    const Image = await cloudinary.uploader.upload(userImage);

    // Update user profile in the database
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { Image: profilePicture.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      // Handle case where user with the specified email is not found
      res.status(404);
      throw new Error("User not found");
    }

    res
      .status(200)
      .json({ message: "Profile Updated Successfully", updatedUser });
  } catch (error) {
    // Handle errors
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const EditProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: `User Profile Updated Successfully for ${req.params.id}`,
  });
});

const DeleteProfile = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deleteUser = await UserModel.findByIdAndDelete(id);
  if (deleteUser) {
    return res
      .status(200)
      .json({ message: "User Deleted Successfully", deleteUser });
  } else {
    throw new Error("User not found");
  }
});

module.exports = { SignUp, Signin, EditProfile, DeleteProfile, SetUpProfile };
