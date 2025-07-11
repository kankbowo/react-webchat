import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    online_users: 0,
    total_messages: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/statistik', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          setError(data.error || 'Gagal mengambil statistik');
        }
      } catch (err) {
        setError('Gagal terhubung ke server');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📊 Dashboard Admin</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Memuat statistik...</p>
      ) : (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card text-bg-primary shadow-sm">
              <div className="card-body text-center">
                <h5>Total User</h5>
                <h3>{stats.total_users}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-bg-success shadow-sm">
              <div className="card-body text-center">
                <h5>User Online</h5>
                <h3>{stats.online_users}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-bg-warning shadow-sm">
              <div className="card-body text-center">
                <h5>Pesan Terkirim</h5>
                <h3>{stats.total_messages}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
