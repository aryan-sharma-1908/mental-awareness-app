import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../config";

const rawSocket = import.meta.env.VITE_CHAT_SERVER;
const SOCKET_URL =
  typeof rawSocket === "string" &&
  rawSocket &&
  rawSocket !== "undefined" &&
  rawSocket !== "null"
    ? rawSocket
    : typeof BASE_URL === "string"
      ? BASE_URL.replace(/^http/, "ws")
      : undefined;

const FALLBACK_SOCKET_URL =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin.replace(/^http/, "ws")
    : undefined;

let socketInstance = null;

export function useSocket() {
  const socketRef = useRef(socketInstance);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("jwt") : null;

  useEffect(() => {
    // Already connected — nothing to do
    if (socketInstance && socketInstance.connected) {
      socketRef.current = socketInstance;
      return;
    }

    if (!token) return;

    // Clean up stale socket
    if (socketInstance) {
      try {
        socketInstance.removeAllListeners();
        socketInstance.close();
      } catch (e) {}
      socketInstance = null;
    }

    const opts = { autoConnect: false, auth: { token } };

    try {
      socketInstance = io(SOCKET_URL, opts);
    } catch (err) {
      console.warn("Primary URL failed, trying fallback:", err);
      socketInstance = io(FALLBACK_SOCKET_URL ?? undefined, opts);
    }

    socketInstance.on("connect_error", (err) =>
      console.warn("connect_error:", err),
    );
    socketInstance.on("error", (err) => console.warn("socket error:", err));

    socketInstance.connect();
    socketRef.current = socketInstance;
  }, [token]);

  return socketRef.current;
}

export function useChat(otherUserId) {
  const socket = useSocket();
  const [chatId, setChatId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket || !otherUserId || !socket.connected) return;

    const handleOpenChat = (resp) => {
      if (resp?.chatId) {
        setChatId(resp.chatId);
        setParticipants(resp.participants || []);
        fetch(`/api/chat/${resp.chatId}/messages`, {
          headers: { Authorization: localStorage.getItem("jwt") },
        })
          .then((r) => r.json())
          .then((data) => setMessages(data.messages || []))
          .catch((err) => console.error("fetch messages error", err));
      } else {
        console.error("open_chat failed", resp);
      }
    };

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        if (!msg?._id) return prev;
        if (prev.some((m) => String(m._id) === String(msg._id))) return prev;
        return [...prev, msg];
      });
    };

    socket.emit("open_chat", { otherUserId }, handleOpenChat);
    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, otherUserId, socket?.connected]);

  function send(text) {
    if (!chatId || !socket) return Promise.reject("no_chat");
    return new Promise((resolve) => {
      socket.emit("send_message", { chatId, text }, (ack) => {
        if (ack?.ok) {
          const msg = ack.message;
          setMessages((prev) => {
            if (!msg?._id) return prev;
            if (prev.some((m) => String(m._id) === String(msg._id)))
              return prev;
            return [...prev, msg];
          });
          resolve(msg);
        } else resolve(null);
      });
    });
  }

  return { chatId, participants, messages, send };
}
