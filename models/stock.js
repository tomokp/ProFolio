// import mongoose from 'mongoose';
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    Symbol: String,
    Stockname: String,
    Price: String,
});

module.exports = mongoose.model('Stock', stockSchema);