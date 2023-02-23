// server/models/Pool.js
const mongoose = require('mongoose');
let SystemSchema = new mongoose.Schema(
    {
        id: Number,
        timer: {
            type: Number,
            default: 0
        },
    }
);
module.exports = mongoose.model('System', SystemSchema);