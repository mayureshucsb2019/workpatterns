const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    'message-id': {
        type: String,
        required: true,
    },
    'in-reply-to': {
        type: String,
        ref: 'Organisation'
    },
    time: {
        type: Number,
        required: true,
    },
    addresses: [{
        role: String,
        address: String
    }]
});

const MessageSchema = mongoose.model('MessageSchema', messageSchema);
module.exports = MessageSchema;