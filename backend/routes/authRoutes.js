const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, getUserInfo, updateProfileImage, removeProfileImage, updateProfile, updatePassword } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser', protect, getUserInfo);

router.post('/upload-image', upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${
    req.file.filename
    }`;
    res.status(200).json({ imageUrl });
});

// update profile image
router.put('/profile-image', protect, updateProfileImage);
// remove profile image
router.delete('/profile-image', protect, removeProfileImage);
// update profile info
router.put('/profile', protect, updateProfile);
// update password
router.put('/password', protect, updatePassword);

module.exports = router;
