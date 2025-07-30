const express = require("express");
const router = express.Router();
const {
    addComment,
    getCommentsByBlogId
} = require("../controllers/commentController");

router.post("/insert/:blog_id", addComment);
router.get("/getall/:blog_id", getCommentsByBlogId);

module.exports = router;
