const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, aadhar, mobile } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            aadhar,
            mobile
        });

        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            mobile: user.mobile,
            aadhar: user.aadhar,

        });
    } catch (error) {
        console.error('Error creating user:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }

        if (error.code === 11000) { // Duplicate key error code
            return res.status(400).json({ message: 'Duplicate field value entered' });
        }

        res.status(500).json({ message: 'Server error' });
    }
};


// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // exclude password field
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Update a user
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password, role, mobile, aadhar } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.mobile = mobile || user.mobile;
        user.aadhar = aadhar || user.aadhar;
        user.email = email || user.email;
        user.role = role || user.role;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            mobile: user.mobile,
            aadhar: user.aadhar,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
