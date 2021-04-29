import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    Symbol: String,
    Stockname: String,
    Price: String,
});

export default mongoose.model('Stock', stockSchema);