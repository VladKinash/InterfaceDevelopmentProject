const mongoose = require('mongoose');

var user = new mongoose.Schema({
    username: String,
    password: String,
    fullName: String,
    email: String,
    dateOfBirth: Date
}, {collection: 'users'});

const User = mongoose.model('User', user);

module.exports = User