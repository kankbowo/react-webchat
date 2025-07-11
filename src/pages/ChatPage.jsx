import React, { useState, useEffect } from 'react';

const ChatPage = () => {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: ganti ke fetch API yang benar
    const fetchChannels = async () => {
      try {
        const res = await fetch('/api/channels', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) {
          setChannels(data);
          setActiveChannel(data[0]); // default aktif pertama
        }
      } catch (err) {
        console.error('Gagal ambil channel:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    if (!activeChannel) return;
    // TODO: ganti ke fetch messages dari channel aktif
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/channels/${activeChannel.id}/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) setMessages(data);
      } catch (err) {
        console.error('Gagal ambil pesan:', err);
      }
    };

    fetchMessages();
  }, [activeChannel]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    try {
      const res = await fetch(`/api/channels/${activeChannel.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newMsg })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, data]);
        setNewMsg('');
      }
    } catch (err) {
      alert('Gagal mengirim pesan');
    }
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        {/* Sidebar Channel */}
        <div className="col-md-3 border-end">
          <h5>Channel</h5>
          {loading ? (
            <p>Memuat...</p>
          ) : (
            <ul className="list-group">
              {channels.map((ch) => (
                <li
                  key={ch.id}
                  className={`list-group-item ${
                    activeChannel?.id === ch.id ? 'active' : ''
                  }`}
                  onClick={() => setActiveChannel(ch)}
                  style={{ cursor: 'pointer' }}
                >
                  #{ch.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Chat Room */}
        <div className="col-md-9 d-flex flex-column" style={{ height: '80vh' }}>
          <div className="border-bottom mb-2">
            <h5 className="mt-2">#{activeChannel?.name || 'Pilih Channel'}</h5>
          </div>

          <div className="flex-grow-1 overflow-auto border p-3 mb-2" style={{ background: '#f9f9f9' }}>
            {messages.length === 0 ? (
              <p className="text-muted">Belum ada pesan</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="mb-2">
                  <strong>{msg.sender}</strong>: {msg.content}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Ketik pesan..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Kirim</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
