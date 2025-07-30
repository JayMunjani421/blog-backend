const connection = require('../config/connection');
const BASE_URL = process.env.BASE_URL;
const path = require('path');
const fs = require('fs');

const getAllBlogs = (req, resp) => {
    connection.query('SELECT * FROM tbl_blog', (err, results) => {
        if (err) return resp.status(500).json({ status: false, message: err.message });

        resp.status(200).json({
            status: true,
            data: results
        });
    });
};

const getBlogById = (req, resp) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM tbl_blog WHERE blog_id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) return resp.status(500).json({ status: false, message: err.message });

        if (results.length === 0) {
            return resp.status(404).json({ status: false, message: 'Blog not found.' });
        }
        resp.status(200).json({ status: true, data: results[0] });
    });
};

const insertBlog = async (req, resp) => {
    try {
        const { title, description, media_url } = req.body;
        let finalMediaUrl = '';

        // If file is uploaded
        if (req.file) {
            const filename = req.file.filename;
            finalMediaUrl = `${BASE_URL}/uploads/${filename}`;
        }
        // If media_url is provided manually
        else if (media_url) {
            finalMediaUrl = media_url;
        } else {
            return resp.status(400).json({
                status: false,
                message: "Please upload a file or provide a media URL"
            });
        }
        connection.query(
            "INSERT INTO tbl_blog (title, description, media_url) VALUES (?, ?, ?)",
            [title, description, finalMediaUrl],
            function (error, results) {
                if (error) {
                    console.error(error);
                    return resp.status(500).json({ status: false, message: error.message });
                }
                return resp.status(200).json({
                    status: true,
                    message: "Blog inserted successfully"
                });
            }
        );
    } catch (error) {
        console.error(error);
        return resp.status(500).json({ status: false, message: "Server Error" });
    }
};

const updateBlog = async (req, resp) => {
    const blog_id = req.params.id;
    const { title, description } = req.body;

    try {
        // First, get the current blog's media_url from DB
        connection.query('SELECT media_url FROM tbl_blog WHERE blog_id = ?', [blog_id], (err, results) => {
            if (err || results.length === 0) {
                return resp.status(404).json({ status: false, message: 'Blog not found' });
            }

            const oldMediaUrl = results[0].media_url;

            let updatedMediaUrl = oldMediaUrl;

            // If new file is uploaded
            if (req.file) {
                const filename = req.file.filename;
                updatedMediaUrl = `${process.env.BASE_URL}/uploads/${filename}`;

                // Delete the old file from the uploads folder
                const oldFilePath = path.join(__dirname, '../uploads/', path.basename(oldMediaUrl));
                fs.unlink(oldFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.warn('Could not delete old media file:', oldFilePath);
                    }
                });
            }

            // Now update the blog with new data
            connection.query(
                'UPDATE tbl_blog SET title = ?, description = ?, media_url = ?, updated_at = NOW() WHERE blog_id = ?',
                [title, description, updatedMediaUrl, blog_id],
                (updateErr, result) => {
                    if (updateErr) {
                        return resp.status(500).json({ status: false, message: updateErr.message });
                    }
                    return resp.status(200).json({ status: true, message: 'Blog updated successfully' });
                }
            );
        });

    } catch (error) {
        console.error(error);
        return resp.status(500).json({ status: false, message: 'Server error' });
    }
};

const deleteBlog = (req, resp) => {
    const blog_id = req.params.id;

    connection.query('SELECT media_url FROM tbl_blog WHERE blog_id = ?', [blog_id], (err, results) => {
        if (err) {
            return resp.status(500).json({ status: false, message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return resp.status(404).json({ status: false, message: 'Blog not found' });
        }

        const mediaUrl = results[0].media_url;
        const mediaFile = path.basename(mediaUrl); // get just the filename
        const filePath = path.join(__dirname, '../uploads/', mediaFile);

        connection.query('DELETE FROM tbl_blog WHERE blog_id = ?', [blog_id], (deleteErr, result) => {
            if (deleteErr) {
                return resp.status(500).json({ status: false, message: 'Failed to delete blog', error: deleteErr });
            }

            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.warn('File not found or already deleted:', filePath);
                }
            });

            return resp.status(200).json({ status: true, message: 'Blog deleted successfully' });
        });
    });
};

module.exports = {
    insertBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};
