import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL } from '../config';

// Primary socket URL (from explicit env) or derived from BASE_URL
const rawSocket = import.meta.env.VITE_CHAT_SERVER;
const SOCKET_URL = (typeof rawSocket === 'string' && rawSocket && rawSocket !== 'undefined' && rawSocket !== 'null')
  ? rawSocket
  : (typeof BASE_URL === 'string' ? BASE_URL.replace(/^http/, 'ws') : undefined);

// Fallback: derive from current page origin (useful if backend runs on different port)
const FALLBACK_SOCKET_URL = (typeof window !== 'undefined' && window.location && window.location.origin)
  ? window.location.origin.replace(/^http/, 'ws')
  : undefined;

let socketInstance = null;
let socketInitialized = false;

export function useSocket() {
  const socketRef = useRef(socketInstance);
  // Read token at render time so effect can react when token changes (e.g. login)
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    
    // Only create/recreate socket if token is available
    if (token && (!socketInstance || !socketInstance.connected)) {
      // Close old socket if exists
      if (socketInstance) {
        try {
          socketInstance.close();
        } catch (e) {}
      }

      // Create new socket with token
      const opts = { autoConnect: false, auth: { token } };
      try {
        socketInstance = io(SOCKET_URL, opts);
        console.info('Socket created with primary URL:', SOCKET_URL);
      } catch (err) {
        console.warn('Failed to create socket with primary URL', SOCKET_URL, err);
        if (FALLBACK_SOCKET_URL) {
          socketInstance = io(FALLBACK_SOCKET_URL, opts);
          console.info('Socket created with fallback URL:', FALLBACK_SOCKET_URL);
        } else {
          socketInstance = io(undefined, opts);
        }
      }

      // Add error handlers
      if (socketInstance) {
        socketInstance.on('connect_error', (err) => {
          console.warn('socket connect_error:', err);
        });
        socketInstance.on('error', (err) => {
          console.warn('socket error:', err);
        });
        // Ensure the socket is connected so user-level events arrive even when not
        // actively viewing a chat. We created the socket with autoConnect: false
        // so explicitly connect here after creation.
        try {
          if (!socketInstance.connected) socketInstance.connect();
        } catch (e) {
          console.warn('socket connect failed on create', e);
        }
      }

      socketRef.current = socketInstance;
    }

    return () => {
      // Don't disconnect socket, keep it alive
    };
  }, [token]);

  return socketRef.current;
}

export function useChat(otherUserId) {
  const socket = useSocket();
  const [chatId, setChatId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;
    socket.connect();
    return () => { socket.disconnect(); };
  }, [socket]);

  useEffect(() => {
    if (!socket || !otherUserId) return;
    
    const handleOpenChat = (resp) => {
      if (resp && resp.ok) {
        setChatId(resp.chatId);
        setParticipants(resp.participants);
        fetch(`/api/chats/${resp.chatId}/messages`, {
          headers: { Authorization: localStorage.getItem('jwt') }
        }).then(r => r.json()).then(data => setMessages(data.messages || [])).catch(err => console.error('fetch messages error', err));
      } else {
        console.error('open_chat failed', resp);
      }
    };

    const handleNewMessage = (msg) => {
      setMessages(prev => {
        if (!msg || !msg._id) return prev;
        if (prev.some(m => String(m._id) === String(msg._id))) return prev;
        return [...prev, msg];
      });
    };

    socket.emit('open_chat', { otherUserId }, handleOpenChat);
    socket.on('new_message', handleNewMessage);

    return () => { socket.off('new_message', handleNewMessage); };
  }, [socket, otherUserId]);

  function send(text) {
    if (!chatId || !socket) return Promise.reject('no_chat');
    return new Promise((resolve) => {
      socket.emit('send_message', { chatId, text }, (ack) => {
        if (ack && ack.ok) {
          // append to local messages if not already present
          const msg = ack.message;
          setMessages(prev => {
            if (!msg || !msg._id) return prev;
            if (prev.some(m => String(m._id) === String(msg._id))) return prev;
            return [...prev, msg];
          });
          resolve(msg);
        } else resolve(null);
      });
    });
  }

  return { chatId, participants, messages, send };
}
