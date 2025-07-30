const connection = require('../config/connection');

// Add comment to a blog
const addComment = (req, resp) => {
    const blog_id = req.params.blog_id;
    const { comment, name } = req.body;

    if (!comment) {
        return resp.status(400).json({ status: false, message: "Comment is required" });
    }

    connection.query('INSERT INTO tbl_comment (blog_id, comment, name) VALUES (?, ?, ?)', [blog_id, comment, name], (err, result) => {
        if (err) {
            return resp.status(500).json({ status: false, message: err.message });
        }
        resp.status(200).json({ status: true, message: "Comment added successfully" });
    });
};

// Get all comments for a blog
const getCommentsByBlogId = (req, resp) => {
    const blog_id = req.params.blog_id;

    connection.query('SELECT * FROM tbl_comment WHERE blog_id = ?', [blog_id], (err, results) => {
        if (err) {
            return resp.status(500).json({ status: false, message: err.message });
        }
        resp.status(200).json({ status: true, data: results });
    });
};

module.exports = {
    addComment,
    getCommentsByBlogId
};
