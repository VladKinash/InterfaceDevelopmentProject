const mongoose = require('mongoose');

var message = new mongoose.Schema({
    name: String,
    email: String,
    text: String,
    createdAt: Date
}, {collection: 'messages'});

const Message = mongoose.model('Message', message);

module.exports = Message