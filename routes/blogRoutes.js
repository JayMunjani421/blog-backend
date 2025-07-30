const express = require('express');
const blogRoutes = express.Router();
const {
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    insertBlog
} = require('../controllers/blogController');

const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public Routes
blogRoutes.get('/getall', getAllBlogs);
blogRoutes.get('/getbyid/:id', getBlogById);

// Protected Routes (Admin only)
blogRoutes.post('/insert', verifyToken, upload.single('media_url'), insertBlog);
blogRoutes.put('/update/:id', verifyToken, upload.single('media_url'), updateBlog);
blogRoutes.delete('/delete/:id', verifyToken, deleteBlog);

module.exports = blogRoutes;
