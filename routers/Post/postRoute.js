const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../middleware/token');
const { 
    showAll, 
    showDetail, 
    showGameDetail,
    createPost,  
    deletePost
} = require('../../controllers/Post/postController');

router.get('/', showAll);
router.get('/:post_key', showDetail);
router.get('/:post_key/game', showGameDetail);
router.post('/create', verifyToken, createPost);
router.delete('/delete/:post_key', verifyToken, deletePost);

module.exports = router;