// src/pages/NoticeForm.jsx
import React, { useState, useEffect } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import db from '../utils/db';

const NoticeForm = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePublicId, setImagePublicId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [notices, setNotices] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const cld = new Cloudinary({ cloud: { cloudName: 'deyvimtcm' } });

 const styles = {
  container: {
    maxWidth: 600,
    margin: '2rem auto',
    padding: 24,
    background: 'rgba(20, 20, 20, 0.6)',
    borderRadius: 16,
    color: '#ffffff',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  header: {
    marginBottom: 16,
    fontSize: 28,
    textAlign: 'center',
    color: '#ffffff',
  },
  textarea: {
    width: '100%',
    padding: 14,
    fontSize: 16,
    borderRadius: 8,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    background: 'rgba(30, 30, 30, 0.8)',
    color: '#ffffff',
    marginBottom: 16,
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  fileInput: {
    marginBottom: 16,
    color: '#ffffff',
  },
  button: {
    padding: '10px 20px',
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    marginRight: 8,
    transition: 'all 0.3s ease',
  },
  uploadBtn: {
    background: '#007aff',
    color: '#ffffff',
  },
  postBtn: {
    background: '#28cd41',
    color: '#ffffff',
  },
  previewSection: {
    marginTop: 24,
    textAlign: 'center',
  },
  previewImage: {
    maxWidth: '100%',
    borderRadius: 10,
  },
  noticesSection: {
    marginTop: 32,
  },
  noticeCard: {
    padding: 16,
    margin: '16px 0',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: '#ffffff',
  },
  noticeDate: {
    fontSize: 12,
    color: '#dddddd',
    marginBottom: 6,
  },
  actionBtn: {
    padding: '6px 12px',
    fontSize: 14,
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    color: '#ffffff',
  },
  editBtn: {
    background: '#ff9500',
  },
  deleteBtn: {
    background: '#ff3b30',
  },
};


  const fetchNotices = async () => {
    const all = await db.Notices.select().then(r => r.all());
    const sorted = all
      .map(n => ({ id: n.id, ...n.fields }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    setNotices(sorted);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleImageUpload = async () => {
    if (!image) return alert('Select an image first.');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'lecture_upload');
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/deyvimtcm/image/upload',
        { method: 'POST', body: formData }
      ).then(r => r.json());
      setImagePublicId(res.public_id);
      alert('Image uploaded!');
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setContent('');
    setImage(null);
    setImagePublicId('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert('Content required');
    const payload = { content, imagePublicId, createdAt: new Date().toISOString() };
    if (editingId) {
      await db.Notices.update(editingId, payload);
      alert('Notice updated!');
    } else {
      await db.Notices.create(payload);
      alert('Notice posted!');
    }
    resetForm();
    fetchNotices();
  };

  const handleEdit = (n) => {
    setEditingId(n.id);
    setContent(n.content);
    setImagePublicId(n.imagePublicId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    await db.Notices.delete(id);
    fetchNotices();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>{editingId ? 'Edit Notice' : 'Post a Notice'}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          style={styles.textarea}
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          placeholder="Write your notice..."
        />
        <input
          style={styles.fileInput}
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={uploading}
          style={{ ...styles.button, ...styles.uploadBtn }}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        <button
          type="submit"
          disabled={uploading}
          style={{ ...styles.button, ...styles.postBtn }}
        >
          {editingId ? 'Update Notice' : 'Post Notice'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ ...styles.button, background: '#5e5e5e', color: '#fff' }}
          >
            Cancel
          </button>
        )}
      </form>

      {imagePublicId && (
        <div style={styles.previewSection}>
          <h4>Preview</h4>
          <AdvancedImage
            cldImg={cld.image(imagePublicId)}
            style={styles.previewImage}
          />
        </div>
      )}

      <div style={styles.noticesSection}>
        <h3 style={{ ...styles.header, fontSize: 20 }}>Recent Notices</h3>
        {notices.length === 0 && <p>No notices yet.</p>}
        {notices.map(n => (
          <div key={n.id} style={styles.noticeCard}>
            <div style={styles.noticeDate}>
              {new Date(n.createdAt).toLocaleString()}
            </div>
            <p>{n.content}</p>
            {n.imagePublicId && (
              <AdvancedImage
                cldImg={cld.image(n.imagePublicId).resize('thumbnail')}
                style={{ width: 120, borderRadius: 6, marginTop: 8 }}
              />
            )}
            <div style={{ marginTop: 12 }}>
              <button onClick={() => handleEdit(n)} style={{ ...styles.actionBtn, ...styles.editBtn }}>
                Edit
              </button>
              <button onClick={() => handleDelete(n.id)} style={{ ...styles.actionBtn, ...styles.deleteBtn }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeForm;
