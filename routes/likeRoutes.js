const express = require('express');
const router = express.Router();

const { addLike, removeLike, getLikesCount } = require('../controllers/likeController');

router.post('/add', addLike);
router.post('/remove', removeLike);
router.get('/get/:blog_id', getLikesCount);

module.exports = router;
