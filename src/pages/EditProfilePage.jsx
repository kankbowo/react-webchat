import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_lengkap: '',
    jabatan: '',
    provinsi: '',
    gender: '',
    agama: '',
    bio: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Ambil data user sendiri
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setForm({
            nama_lengkap: data.nama_lengkap || '',
            jabatan: data.jabatan || '',
            provinsi: data.provinsi || '',
            gender: data.gender || '',
            agama: data.agama || '',
            bio: data.bio || ''
          });
        } else {
          setError(data.error || 'Gagal mengambil data');
        }
      } catch (err) {
        setError('Gagal koneksi ke server');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        alert('Profil berhasil diperbarui!');
        navigate(`/users/${data.id || 'me'}`); // arahkan ke profil
      } else {
        setError(data.error || 'Gagal menyimpan perubahan');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi');
    }
  };

  if (loading) return <p className="text-center mt-4">Memuat data profil...</p>;

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h3>Edit Profil Saya</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nama Lengkap</label>
          <input type="text" name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Jabatan</label>
          <input type="text" name="jabatan" value={form.jabatan} onChange={handleChange} className="form-control" />
        </div>

        <div className="mb-3">
          <label>Provinsi</label>
          <input type="text" name="provinsi" value={form.provinsi} onChange={handleChange} className="form-control" />
        </div>

        <div className="mb-3">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="form-control">
            <option value="">Pilih</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Agama</label>
          <input type="text" name="agama" value={form.agama} onChange={handleChange} className="form-control" />
        </div>

        <div className="mb-3">
          <label>Bio Singkat</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} className="form-control" />
        </div>

        <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
      </form>
    </div>
  );
};

export default EditProfilePage;
