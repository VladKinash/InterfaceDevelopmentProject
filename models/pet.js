const mongoose = require('mongoose');

var pet = new mongoose.Schema({
    name: String,
    vaccines: String,
    species: String,
    sex: String,
    ownerEmail: String,
    dateOfBirth: Date
}, {collection: 'pets'});

const Pet = mongoose.model('Pet', pet);

module.exports = Pet