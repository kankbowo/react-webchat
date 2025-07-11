import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const FriendRequestsPage = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/friends/requests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data);
      } else {
        alert(data.error || 'Gagal memuat permintaan');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  const respondRequest = async (userId, action) => {
    try {
      const res = await fetch(`/api/friends/respond/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== userId));
      } else {
        alert(data.error || 'Gagal memproses');
      }
    } catch (err) {
      alert('Gagal koneksi');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <p>Memuat permintaan...</p>;
  if (requests.length === 0) return <p>Tidak ada permintaan teman.</p>;

  return (
    <div>
      <h2>Permintaan Pertemanan</h2>
      <ul className="list-group">
        {requests.map(req => (
          <li key={req.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{req.username}</strong><br />
              <small>{new Date(req.created_at).toLocaleString()}</small>
            </div>
            <div>
              <button
                className="btn btn-sm btn-success me-2"
                onClick={() => respondRequest(req.id, 'accept')}
              >
                ✅ Terima
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => respondRequest(req.id, 'decline')}
              >
                ❌ Tolak
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequestsPage;
