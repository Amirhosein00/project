const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    "title": String,
    "price": Number,
    "description": String,
    "category": String,
    "image":String,
    "rating":{
        "rate":Number,
        "count":Number
    }
})

const model = mongoose.model("Product", schema)

module.exports = model