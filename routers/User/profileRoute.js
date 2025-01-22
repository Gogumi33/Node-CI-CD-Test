const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../../controllers/User/profileController');
const { verifyToken } = require('../../middleware/token');

router.get('/', verifyToken, getProfile);
router.put('/update', verifyToken, updateProfile);

module.exports = router;