const mongoose = require('mongoose');

var doctor = new mongoose.Schema({
    username: String,
}, {collection: 'doctors'});

const Doctor = mongoose.model('Doctor', doctor);

module.exports = Doctor