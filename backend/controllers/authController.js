const User = require('../models/User');
const jwt = require('jsonwebtoken');

//generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

// register user
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password, profileImageUrl } = req.body;

    // validation - check for missing fields
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    try {
        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // create new user
        const createdUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            profileImageUrl
        });

        // fetch sanitized user without password
        const user = await User.findById(createdUser._id).select('-password');

        res.status(201).json({
            _id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error Registering User', error: error.message });
    }
};

// login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // validation - check for missing fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    try {
        // check if user exists
        const userWithPassword = await User.findOne({ email });
        if (!userWithPassword || !(await userWithPassword.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }   

        const user = await User.findById(userWithPassword._id).select('-password');
        res.status(200).json({
            _id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error Logging In User', error: error.message });
    }
};

// get user info
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error Fetching User Info', error: error.message });
    }
};

// update profile image URL
exports.updateProfileImage = async (req, res) => {
    try {
        const { profileImageUrl } = req.body;
        if (!profileImageUrl) {
            return res.status(400).json({ message: 'profileImageUrl is required' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { profileImageUrl },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: 'Error Updating Profile Image', error: error.message });
    }
};