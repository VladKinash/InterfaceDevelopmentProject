const mongoose = require('mongoose');

var pet = new mongoose.Schema({
    name: String,
    vaccines: String,
    species: String,
    breed: String,
    sex: String,
    passportID: String,
    ownerEmail: String,
    dateOfBirth: Date
}, {collection: 'users'});

const Pet = mongoose.model('Pet', pet);

module.exports = Pet