const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: String,
    description: String,
    quantity: Number,
    url: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);