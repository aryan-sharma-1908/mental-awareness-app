const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId: { type: String, required: true, index: true},
    senderId: { type: String, required: true},
    text: { type: String, required: true},
    createdAt: { type: Date, default: Date.now, index: true},
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent'}
})

module.exports = mongoose.model('Message', messageSchema);