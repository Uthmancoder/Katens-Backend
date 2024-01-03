const express = require("express");
const router = express.Router();
const { SignUp, Signin, EditProfile, DeleteProfile, SetUpProfile } = require("../Controllers/UserController")

router.post("/signup", SignUp);
router.post("/signin", Signin);
router.post("/setProfile", SetUpProfile);
router.put("/EditProfile/:id", EditProfile);
router.delete("/DeleteProfile/:id", DeleteProfile);

module.exports = router; 