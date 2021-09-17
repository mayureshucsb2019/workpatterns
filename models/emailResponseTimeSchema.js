const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
    },
    times: [Number]
});

const EmailResponseTimeSchema = mongoose.model('EmailResponseTimeSchema', messageSchema);
module.exports = EmailResponseTimeSchema;