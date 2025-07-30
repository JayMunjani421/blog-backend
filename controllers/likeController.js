const connection = require('../config/connection');

const addLike = (req, resp) => {
    const { blog_id } = req.body;
    const ip = req.ip;

    if (!blog_id) {
        return resp.status(400).json({ status: false, message: "Blog ID is required" });
    }

    // Check if this IP already liked this blog
    connection.query(
        'SELECT * FROM tbl_like WHERE blog_id = ? AND ip = ?',
        [blog_id, ip],
        (err, results) => {
            if (err) return resp.status(500).json({ status: false, message: err.message });

            if (results.length > 0) {
                return resp.status(400).json({ status: false, message: "You already liked this blog" });
            }

            // Insert like record
            connection.query(
                'INSERT INTO tbl_like (blog_id, ip) VALUES (?, ?)',
                [blog_id, ip],
                (error, result) => {
                    if (error) return resp.status(500).json({ status: false, message: error.message });

                    // Update the like_count in tbl_blog
                    connection.query(
                        'UPDATE tbl_blog SET likes_count = likes_count + 1 WHERE blog_id = ?',
                        [blog_id],
                        (updateErr, updateResult) => {
                            if (updateErr) {
                                return resp.status(500).json({ status: false, message: updateErr.message });
                            }

                            return resp.status(200).json({ status: true, message: "Liked successfully" });
                        }
                    );
                }
            );
        }
    );
};

const removeLike = (req, resp) => {
  const { blog_id } = req.body;
  const ip = req.ip;

  if (!blog_id) {
    return resp.status(400).json({ status: false, message: "Blog ID is required" });
  }

  connection.query(
    'DELETE FROM tbl_like WHERE blog_id = ? AND ip = ?',
    [blog_id, ip],
    (err, result) => {
      if (err) return resp.status(500).json({ status: false, message: err.message });

      if (result.affectedRows === 0) {
        return resp.status(404).json({ status: false, message: "Like not found" });
      }

      // Decrement like_count in tbl_blog
      connection.query(
        'UPDATE tbl_blog SET likes_count = IF(likes_count > 0, likes_count - 1, 0) WHERE blog_id = ?',
        [blog_id],
        (updateErr) => {
          if (updateErr) {
            return resp.status(500).json({ status: false, message: updateErr.message });
          }

          return resp.status(200).json({ status: true, message: "Like removed successfully" });
        }
      );
    }
  );
};

// Get total likes for a blog
const getLikesCount = (req, resp) => {
  const blog_id = req.params.blog_id;

  connection.query(
    'SELECT COUNT(*) AS likeCount FROM tbl_like WHERE blog_id = ?',
    [blog_id],
    (err, results) => {
      if (err) return resp.status(500).json({ status: false, message: err.message });

      return resp.status(200).json({ status: true, likes: results[0].likeCount });
    }
  );
};

module.exports = {
  addLike,
  removeLike,
  getLikesCount,
};
