const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Add any additional user fields as necessary
});

module.exports = mongoose.model('User', UserSchema);
