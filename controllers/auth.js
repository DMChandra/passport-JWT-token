const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtkey = require('../config/secretKey')

const register = async (req, res) => {
    const { userName, password } = req.body;

    const existingUser = await User.findOne({ userName });

    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = new User({ userName, password });

    newUser.save()
        .then(() => res.json({ success: true }))
        .catch(error => res.status(400).json({ success: false, error }));
}

const login = async (req, res) => {
    const { userName, password } = req.body;


    try {

        const user = await User.findOne({ userName });

        if (user) {

            user.comparePassword(password, (error, isMatch) => {
                if (error) {
                    res.status(500).json({ success: false, error });
                } else if (!isMatch) {
                    res.status(401).json({ success: false, message: 'Incorrect password' });
                    
                } else {
                    const payload = { id: user._id, userName: user.userName };
                    const token = jwt.sign(payload, jwtkey, { expiresIn: '1h' });
                    res.json({ success: true, token: `Bearer ${token}` });
                }
            });

        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }

    } catch (error) {
        res.status(500).json({ success: false, error });
    }


}

const getCredentials = (req, res) => {
    res.json({ success: true, user: req.user });
}

module.exports = { register, login, getCredentials }

