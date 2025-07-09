import React, { useEffect, useState, useRef } from 'react';
import socket from './socket';

function Chat({ username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat-message', (data) => {
      setMessages((prev) => [...prev, { ...data, animate: true }]);
      setTimeout(() => {
        setMessages((prev) => prev.map((msg, i) => i === prev.length - 1 ? { ...msg, animate: false } : msg));
      }, 300);
    });
    return () => {
      socket.off('chat-message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    socket.emit('chat-message', { user: username || 'Anonymous', msg: input });
    setInput('');
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ height: 180, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, marginBottom: 10, background: '#f9f9f9', boxShadow: '0 2px 8px #0001' }}>
        {messages.map((msg, idx) => {
          const isMe = msg.user === username;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                marginBottom: 6,
                transition: 'transform 0.3s',
                transform: msg.animate ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <div
                style={{
                  background: isMe ? 'linear-gradient(90deg,#1976d2,#43a047)' : '#fff',
                  color: isMe ? '#fff' : '#333',
                  borderRadius: 16,
                  padding: '8px 14px',
                  maxWidth: '70%',
                  boxShadow: isMe ? '0 2px 8px #1976d233' : '0 2px 8px #0001',
                  fontSize: 15,
                  wordBreak: 'break-word',
                  border: isMe ? 'none' : '1px solid #e0e0e0',
                  fontWeight: isMe ? 500 : 400
                }}
              >
                <span style={{ fontSize: 12, opacity: 0.7, marginRight: 6 }}>{isMe ? 'You' : msg.user}</span><br />
                {msg.msg}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          id="chat-input"
          name="chat-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10, borderRadius: 20, border: '1px solid #ccc', fontSize: 15, outline: 'none', background: '#fff' }}
        />
        <button type="submit" style={{ padding: '0 20px', borderRadius: 20, background: 'linear-gradient(90deg,#1976d2,#43a047)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px #1976d233', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 4 }}>Send</span>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M2 21l21-9-21-9v7l15 2-15 2v7z"/></svg>
        </button>
      </form>
    </div>
  );
}

export default Chat; 