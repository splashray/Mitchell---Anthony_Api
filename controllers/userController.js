// The `userController.js` file will contain our user controller, which will handle fetching and updating user information.

// controllers/userController.js
const User = require('../models/userModel');

//Get Profile
async function getProfile(req, res) {
try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ 
        email: user.email, 
        username: user.username 
    });
} catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
}
}


//Update Password 
async function updatePassword(req, res) {
try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
    return res.status(400).send('Invalid password');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(204).send();
} catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
}
}


//Update Profile
async function updateProfile(req, res) {
try {
    const { email, username } = req.body;
    const user = await User.findById(req.user.id);
    user.email = email || user.email;
    user.username = username || user.username;
    await user.save();
    
    res.status(204).send();
} catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
}
}

module.exports = {
    getProfile,
    updatePassword,
    updateProfile
};