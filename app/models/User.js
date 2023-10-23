const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, maxLength: 255, require: true },
    email: { type: String, maxLength: 255, require: true },
    hashed_password: { type: Buffer },
    salt: { type: Buffer },
});

module.exports = mongoose.model('User', UserSchema);