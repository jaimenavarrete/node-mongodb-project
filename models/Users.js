const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    status: Number,
    country: String,
    company: String,
    nombre: String,
    email: String
});

module.exports = mongoose.model('User', usersSchema);