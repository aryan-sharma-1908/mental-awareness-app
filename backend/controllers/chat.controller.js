const Chat = require('../models/chat.model.js');
const Message = require('../models/message.model.js');
const { genAnonName } = require('../utils/genAnonName');

function chatIdFor(u1, u2){ return [u1,u2].sort().join('_'); }

exports.openChat = async (req, res) => {
     const userId = req.user._id;
      const { otherUserId } = req.body;
      if (!otherUserId) return res.status(400).json({ error: 'otherUserId required' });
      const chatId = chatIdFor(userId, otherUserId);
      let chat = await Chat.findById(chatId).lean();
      if (!chat) {
        const d1 = genAnonName(), d2 = genAnonName();
        await Chat.create({ _id: chatId, participants: [{ userId, displayName: d1 }, { userId: otherUserId, displayName: d2 }] });
        chat = await Chat.findById(chatId).lean();
      }
      res.json({ chatId: chat._id, participants: chat.participants });
}

exports.messageHandler = async (req, res) => {
    const userId = req.user._id;
      const { chatId } = req.params;
      const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
      const before = req.query.before ? new Date(req.query.before) : new Date();
    
      const chat = await Chat.findById(chatId).lean();
      if (!chat || !chat.participants.some(p => p.userId === userId)) return res.status(403).json({ error: 'not_allowed' });
    
      const messages = await Message.find({ chatId, createdAt: { $lt: before } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    
      res.json({ messages: messages.reverse() });
}