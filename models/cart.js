const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    product: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product"}
})

const model = mongoose.model("Cart", schema)

module.exports = model