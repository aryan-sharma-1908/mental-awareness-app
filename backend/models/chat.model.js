const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    displayName: { type: String, required: true },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema({
  _id: { type: String},
  participants: { type: [participantSchema], required: true},
  lastMessage: { text: String, senderId: String, createdAt: Date},
  updatedAt: { type: Date, default: Date.now}
});

module.exports =  mongoose.model('Chat', chatSchema);
