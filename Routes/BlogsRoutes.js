const express = require("express")
const router = express.Router()
const {CreatePost, GetAllPost, EditPost, GetSinglePost, DeletePost, } = require("../Controllers/BlogsController")

 router.post("/CreatePost", CreatePost);
 router.get("/GetAllPost", GetAllPost);
 router.put("/EditPost/:id", EditPost);
 router.delete("/DeletePost/:id", DeletePost)
 router.get("/GetPost/:id", GetSinglePost)


module.exports = router;        