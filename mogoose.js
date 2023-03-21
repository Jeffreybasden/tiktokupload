const mongoose = require('mongoose')

const Videos = new mongoose.Schema({
    id:Number,
    src: String,
    downloaded: String,
    title: String,
    uploaded : String,
    des: String,
    filepath: String
})

module.exports = mongoose.model('Videos',Videos)