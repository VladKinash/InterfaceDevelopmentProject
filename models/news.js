const mongoose = require('mongoose');

var news = new mongoose.Schema({
    title: String,
    text: String,
    createdAt: Date
}, {collection: 'news'});

const News = mongoose.model('News', news);

module.exports = News