// backend/socket-server.js
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Chat = require("./models/chat.model.js");
const Message = require("./models/message.model.js");
const { genAnonName } = require("./utils/genAnonName");

function chatIdFor(u1, u2) {
  return [u1, u2].sort().join("_");
}

function startSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
  });

  console.log("[Socket.IO] Server initialized");

  io.use((socket, next) => {
    console.log("[Socket.IO] Middleware check - received connection attempt");
    const token = socket.handshake.auth?.token;
    console.log("[Socket.IO] Token present:", !!token);
    if (!token) {
      console.warn("[Socket.IO] No token provided, rejecting");
      return next(new Error("Auth error"));
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log("[Socket.IO] Token verified, userId:", payload._id);
      socket.user = { id: payload._id };
      return next();
    } catch (err) {
      console.warn("[Socket.IO] Token verification failed:", err.message);
      return next(new Error("Auth error"));
    }
  });

  // helper: compute and emit the list of chats with unread counts for a specific user
  async function sendChatsListTo(userId) {
    try {
      const chats = await Chat.find({ "participants.userId": userId }).lean();
      const results = await Promise.all(
        chats.map(async (c) => {
          const other = c.participants.find((p) => p.userId !== userId) || {};
          const last = c.lastMessage || null;
          const unread = await Message.countDocuments({
            chatId: c._id,
            senderId: { $ne: userId },
            status: { $ne: "read" },
          });
          return {
            chatId: c._id,
            otherUserId: other.userId,
            displayName: other.displayName,
            lastMessage: last
              ? {
                  text: last.text,
                  senderId: last.senderId,
                  createdAt: last.createdAt,
                }
              : null,
            updatedAt: c.updatedAt,
            unread,
          };
        }),
      );
      io.to(`user_${userId}`).emit("chats_list", results);
    } catch (e) {
      console.warn("sendChatsListTo error", e);
    }
  }

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    console.log("[Socket.IO] Client connected:", userId);
    socket.join(`user_${userId}`);

    // send initial chat list to the connected user
    sendChatsListTo(userId).catch((err) =>
      console.warn("initial chats_list send failed", err),
    );

    socket.on("open_chat", async ({ otherUserId }, ack) => {
      try {
        const chatId = chatIdFor(userId, otherUserId);
        let chat = await Chat.findById(chatId).lean();
        if (!chat) {
          const d1 = genAnonName();
          const d2 = genAnonName();
          await Chat.create({
            _id: chatId,
            participants: [
              { userId, displayName: d1 },
              { userId: otherUserId, displayName: d2 },
            ],
          });
          chat = await Chat.findById(chatId).lean();
        }
        socket.join(`chat_${chatId}`);

        // mark messages as read for this user in this chat
        try {
          await Message.updateMany(
            { chatId, senderId: { $ne: userId }, status: { $ne: "read" } },
            { $set: { status: "read" } },
          );
        } catch (markErr) {
          console.warn("mark read failed", markErr);
        }

        // refresh chat lists for this user and the other participant so unread counts update
        sendChatsListTo(userId).catch(() => {});
        sendChatsListTo(otherUserId).catch(() => {});

        ack &&
          ack({ ok: true, chatId: chat._id, participants: chat.participants });
      } catch (err) {
        console.error("open_chat error", err);
        ack && ack({ ok: false, error: "open_chat_failed" });
      }
    });

    socket.on("send_message", async ({ chatId, text }, ack) => {
      try {
        if (!chatId || !text)
          return ack && ack({ ok: false, error: "invalid_payload" });

        const chat = await Chat.findById(chatId);
        if (!chat) return ack && ack({ ok: false, error: "chat_not_found" });

        const isParticipant = chat.participants.some(
          (p) => p.userId === userId,
        );
        if (!isParticipant)
          return ack && ack({ ok: false, error: "not_allowed" });

        const msg = await Message.create({ chatId, senderId: userId, text });
        chat.lastMessage = { text, senderId: userId, createdAt: msg.createdAt };
        chat.updatedAt = new Date();
        await chat.save();

        const senderPart =
          chat.participants.find((p) => p.userId === userId) || {};
        const senderName = senderPart.displayName || "Anonymous";
        const payload = {
          _id: msg._id,
          chatId,
          senderId: userId,
          senderName,
          text,
          createdAt: msg.createdAt,
        };
        // Emit to anyone currently viewing the chat room
        io.to(`chat_${chatId}`).emit("new_message", payload);

        // Also notify participant user rooms so recipients see notifications
        try {
          const recipients = chat.participants
            .filter((p) => p.userId !== userId)
            .map((p) => p.userId);
          recipients.forEach((rid) => {
            io.to(`user_${rid}`).emit("incoming_message", {
              chatId,
              message: payload,
              from: userId,
            });
          });
        } catch (notifyErr) {
          console.warn("incoming_message notify failed", notifyErr);
        }

        // update chat lists for participants so lastMessage and unread counts refresh
        try {
          const participants = chat.participants.map((p) => p.userId);
          await Promise.all(participants.map((pid) => sendChatsListTo(pid)));
        } catch (e) {
          console.warn("refresh chats_list failed", e);
        }

        ack && ack({ ok: true, message: payload });
      } catch (err) {
        console.error("send_message error", err);
        ack && ack({ ok: false, error: "send_failed" });
      }
    });

    socket.on("join_chat", ({ chatId }, ack) => {
      if (chatId) {
        socket.join(`chat_${chatId}`);
        ack && ack({ ok: true });
      } else ack && ack({ ok: false });
    });

    socket.on("leave_chat", ({ chatId }) => {
      if (chatId) socket.leave(`chat_${chatId}`);
    });

    socket.on("disconnect", () => {});
  });

  return io;
}

module.exports = { startSocketServer };
