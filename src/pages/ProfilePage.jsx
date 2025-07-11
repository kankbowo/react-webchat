import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = user?.id === parseInt(id);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Gagal ambil profil');
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const res = await fetch('/api/users/me/photo', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setProfile(prev => ({ ...prev, photo: data.filename }));
        alert('Foto berhasil diupload!');
      } else {
        alert(data.error || 'Gagal upload');
      }
    } catch (err) {
      alert('Gagal koneksi saat upload');
    }
  };

  if (loading) return <div className="text-center mt-5">Memuat profil...</div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;
  if (!profile) return null;
<Link to="/profile/edit" className="btn btn-sm btn-outline-secondary mt-2">
  ✏️ Edit Profil
</Link>
  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <img
            src={profile.photo ? `/uploads/${profile.photo}` : '/default-profile.png'}
            alt="Foto Profil"
            className="rounded-circle mb-3"
            width="120"
            height="120"
          />
          {isOwnProfile && (
            <form
              className="mb-3"
              onSubmit={handleUpload}
              encType="multipart/form-data"
            >
              <input
                type="file"
                name="photo"
                accept="image/*"
                className="form-control mb-2"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <button className="btn btn-sm btn-primary" type="submit">
                Upload Foto
              </button>
            </form>
          )}

          {/* Nama lengkap dan username */}
          <h3 className="mb-1">{profile.nama_lengkap || '-'}</h3>
          <p className="text-muted mb-1">@{profile.username}</p>
          <p className="text-muted">{profile.jabatan}</p>

          <hr />
          <p><strong>Provinsi:</strong> {profile.provinsi || '-'}</p>
          <p><strong>Gender:</strong> {profile.gender || '-'}</p>
          <p><strong>Agama:</strong> {profile.agama || '-'}</p>
          <p><strong>Bio:</strong> {profile.bio || '-'}</p>
          <p><strong>Teman:</strong> {profile.friend_count || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
