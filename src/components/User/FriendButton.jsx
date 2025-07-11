import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const FriendButton = ({ userId }) => {
  const { token } = useAuth();
  const [status, setStatus] = useState('idle'); // idle, sending, sent, error

  const sendRequest = async () => {
    if (!token) return alert('Harap login terlebih dahulu');

    setStatus('sending');
    try {
      const res = await fetch(`/api/friends/request/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
        alert(data.error || 'Gagal mengirim permintaan');
      }
    } catch (err) {
      setStatus('error');
      alert('Terjadi kesalahan jaringan');
    }
  };

  if (status === 'sent') return <span className="text-success">✅ Terkirim</span>;
  if (status === 'sending') return <button disabled>Mengirim...</button>;

  return (
    <button onClick={sendRequest} className="btn btn-sm btn-outline-primary">
      ➕ Tambah Teman
    </button>
  );
};

export default FriendButton;
