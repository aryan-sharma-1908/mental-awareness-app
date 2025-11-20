import React, { useState, useRef, useEffect, useContext } from 'react';
import { useChat, useSocket } from '../hooks/useChat';
import { AuthContext } from './AuthContext';
import { MessageSquare, X, ChevronDown, ArrowLeft } from 'lucide-react';

export default function ChatBox({ otherUserId }) {
  // Allow opening chat from other components via custom event
  const [targetId, setTargetId] = useState(otherUserId || null);
  useEffect(() => {
    if (otherUserId) setTargetId(otherUserId);
  }, [otherUserId]);

  const { chatId, participants, messages, send } = useChat(targetId || null);
  const socket = useSocket();
  const popupTimerRef = useRef(null);
  const [popup, setPopup] = useState(null);
  const [headerName, setHeaderName] = useState(null);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [showChatList, setShowChatList] = useState(true); // Show list initially
  const [unread, setUnread] = useState(0);
  const [chatHistory, setChatHistory] = useState({}); // Track chats: { userId: { unread, lastMsg, displayName } }
  const listRef = useRef(null);

  const myId = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'))?.id;
    } catch (e) {
      return null;
    }
  })();

  const myAnon = participants.find(p => p.userId === myId)?.displayName;
  const otherAnon = participants.find(p => p.userId !== myId)?.displayName;

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, showChatList]);

  // Global incoming_message handler to update unread counts and show a small popup
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = ({ chatId: incomingChatId, message, from }) => {
      try {
        const parts = String(incomingChatId).split('_');
        const myIdStr = myId != null ? String(myId) : null;
        const otherId = parts.find(id => id !== myIdStr) || String(from);

        setChatHistory(prev => {
          const prevChat = prev[otherId] || {};
          // If currently viewing this chat, do not increment unread
          const viewingThis = open && !showChatList && targetId === otherId;
          const inc = viewingThis ? 0 : 1;
          return {
            ...prev,
            [otherId]: {
              ...prevChat,
              unread: (prevChat.unread || 0) + inc,
              lastMsg: message?.text || prevChat.lastMsg,
              displayName: prevChat.displayName || message?.senderName || 'Anonymous'
            }
          };
        });

        // Show transient popup if not actively viewing this chat
        const showingPopup = !(open && !showChatList && targetId === otherId);
        if (showingPopup) {
          setPopup({ text: message?.text || '', name: message?.senderName || '' });
          if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
          popupTimerRef.current = setTimeout(() => setPopup(null), 4000);
        }
      } catch (e) {
        console.error('handleIncoming error', e);
      }
    };

    const handleChatsList = (list) => {
      try {
        const map = {};
        (list || []).forEach(item => {
          const otherId = String(item.otherUserId || '');
          if (!otherId) return;
          map[otherId] = {
            unread: item.unread || 0,
            lastMsg: item.lastMessage?.text || '',
            displayName: item.displayName || 'Anonymous'
          };
        });
        setChatHistory(map);
      } catch (e) {
        console.error('handleChatsList error', e);
      }
    };

    socket.on('incoming_message', handleIncoming);
    socket.on('chats_list', handleChatsList);
    return () => { socket.off('incoming_message', handleIncoming); socket.off('chats_list', handleChatsList); };
  }, [socket, myId, open, showChatList, targetId]);

  // Listen for global open-anon-chat events
  useEffect(() => {
    function handler(e) {
      const id = e?.detail?.otherUserId;
      const name = e?.detail?.otherUserName;
      if (!id) return;
      setTargetId(id);
      if (name) setHeaderName(name);
      setOpen(true);
      setShowChatList(false); // Open directly into the chat
      setUnread(0);
      // Reset unread for this chat in history
      setChatHistory(prev => ({
        ...prev,
        [id]: { ...prev[id], unread: 0 }
      }));
    }
    window.addEventListener('open-anon-chat', handler);
    return () => window.removeEventListener('open-anon-chat', handler);
  }, []);

  // Update headerName when participants load (use their anon displayName)
  useEffect(() => {
    if (headerName) return;
    if (!participants || participants.length === 0) return;
    const other = participants.find(p => p.userId !== myId);
    if (other) setHeaderName(other.displayName || 'Anonymous');
  }, [participants, headerName, myId]);

  // Track unread messages when panel is closed or in chat list
  const prevMessagesRef = useRef(messages.length);
  useEffect(() => {
    if (!targetId) return;

    if (open && !showChatList) {
      // Chat is open and being viewed, reset unread
      setUnread(0);
      setChatHistory(prev => ({
        ...prev,
        [targetId]: { ...prev[targetId], unread: 0 }
      }));
      prevMessagesRef.current = messages.length;
      return;
    }

    // Chat is not being viewed, track unread
    if (messages.length > prevMessagesRef.current) {
      const newUnread = messages.length - prevMessagesRef.current;
      setUnread(u => u + newUnread);
      setChatHistory(prev => ({
        ...prev,
        [targetId]: {
          ...prev[targetId],
          unread: (prev[targetId]?.unread || 0) + newUnread,
          lastMsg: messages[messages.length - 1]?.text || '',
          displayName: headerName || otherAnon || 'Anonymous'
        }
      }));
    }
    prevMessagesRef.current = messages.length;
  }, [messages, open, showChatList, targetId, headerName, otherAnon]);

  async function onSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await send(text.trim());
      setText('');
    } catch (err) {
      console.error('Send failed', err);
    }
  }

  // Calculate total unread across all chats
  const totalUnread = Object.values(chatHistory).reduce((sum, chat) => sum + (chat.unread || 0), 0);

  const { isAuthenticated } = useContext(AuthContext);

  // Hide chat entirely when user is logged out and cleanup socket/state
  useEffect(() => {
    if (!isAuthenticated) {
      setOpen(false);
      setChatHistory({});
      setPopup(null);
      try { if (socket) socket.disconnect(); } catch (e) {}
    }
  }, [isAuthenticated, socket]);

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating button when closed */}
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            setShowChatList(true);
            setUnread(0);
          }}
          className="relative flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700"
          aria-label="Open chat"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden sm:inline">Chat</span>
          {totalUnread > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{totalUnread}</span>
          )}
        </button>
      )}

      {/* transient popup when new message arrives while not viewing */}
      {popup && (
        <div className="fixed bottom-20 right-6 z-50">
          <div className="bg-white shadow-md rounded-md p-3 max-w-xs">
            <div className="font-semibold text-sm">{popup.name || 'New message'}</div>
            <div className="text-sm text-gray-700">{popup.text}</div>
          </div>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div className="w-[320px] md:w-[380px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-purple-600 text-white">
            <div className="flex items-center gap-2 flex-1">
              {!showChatList && (
                <button onClick={() => setShowChatList(true)} className="p-1 rounded hover:bg-purple-500/30">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <MessageSquare className="w-5 h-5" />
              <div>
                <div className="font-semibold">{showChatList ? 'Messages' : (headerName || otherAnon || 'Anonymous Chat')}</div>
                {!showChatList && <div className="text-xs opacity-80">Anonymous conversation</div>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-purple-500/30">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-purple-500/30">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat List View */}
          {showChatList && (
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {Object.keys(chatHistory).length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-8">No conversations yet</div>
              ) : (
                <div className="divide-y">
                  {Object.entries(chatHistory).map(([userId, chat]) => (
                    <button
                      key={userId}
                      onClick={() => {
                        setTargetId(userId);
                        setHeaderName(chat.displayName);
                        setShowChatList(false);
                        // Reset unread for this specific chat
                        setChatHistory(prev => ({
                          ...prev,
                          [userId]: { ...prev[userId], unread: 0 }
                        }));
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 transition flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">{chat.displayName}</div>
                        <div className="text-sm text-gray-600 truncate">{chat.lastMsg || 'No messages'}</div>
                      </div>
                      {chat.unread > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">{chat.unread}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chat Messages View */}
          {!showChatList && targetId && (
            <>
              <div ref={listRef} className="flex-1 overflow-y-auto p-3 bg-gray-50" style={{ minHeight: 200 }}>
                {messages.length === 0 && (
                  <div className="text-center text-sm text-gray-500 mt-6">No messages yet. Say hello 👋</div>
                )}

                {messages.map(m => {
                  const isMe = m.senderId === myId;
                  const displayName = participants.find(p => p.userId === m.senderId)?.displayName || (isMe ? myAnon : otherAnon) || 'Anonymous';
                  return (
                    <div key={m._id} className={`mb-3 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="text-xs text-gray-500 mb-1">{displayName}</div>
                      <div className={`max-w-[80%] px-3 py-2 rounded-lg ${isMe ? 'bg-green-100 text-gray-900' : 'bg-white text-gray-900'} shadow-sm`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={onSend} className="p-3 border-t bg-white">
                <div className="flex gap-2">
                  <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={chatId ? "Type a message..." : "Connecting..."}
                    disabled={!chatId}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                  <button type="submit" disabled={!chatId} className="bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Send</button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

