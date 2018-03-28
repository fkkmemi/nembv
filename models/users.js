const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, index: true, unique: true },
    pwd: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    lv: { type: Number, default: 5, max: 10 },
    rmk: { type: String, default: '' },
    lang: { type: String, default: 'ko' },
    gender: { type: String, default: 'Male' },
    hidden: { type: String },
    // expires: { type: Date },
});

module.exports = mongoose.model('User', userSchema);
