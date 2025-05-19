import React, { useState } from 'react';
import axios from 'axios';
import db from '../utils/db';
import { useUser } from '@clerk/clerk-react';

// Cloudinary config
const CLOUD_NAME = 'deyvimtcm';
const UPLOAD_PRESET = 'lecture_upload';
const ASSET_FOLDER = 'samples/ecommerce';

// Inline styles
const containerStyle = {
  maxWidth: '600px',
  margin: '40px auto',
  padding: '24px',
  backgroundColor: '#f9f9f9',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  fontFamily: 'Arial, sans-serif',
};
const headingStyle = { fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' };
const errorStyle = { color: '#e63946', marginBottom: '12px', textAlign: 'center' };
const inputStyle = { width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '8px', boxSizing: 'border-box' };
const buttonStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  fontWeight: '600',
  backgroundColor: '#1d4ed8',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};
const buttonHoverStyle = { backgroundColor: '#1e40af' };
const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };

const LectureUpload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const { user } = useUser();
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file || !user) {
      setError('Please select a video file and make sure you are signed in.');
      return;
    }
    if (!file.type.startsWith('video/')) {
      setError('Only video files are allowed.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      // Build a clean public_id:
      // 1) Use title if provided, otherwise file name
      // 2) Trim surrounding whitespace
      // 3) Remove file extension
      // 4) Replace internal spaces with underscores
      const rawId = (title || file.name).trim();
      const noExt = rawId.replace(/\.[^/.]+$/, '').trim();
      const public_id = noExt.replace(/\s+/g, '_');
      formData.append('public_id', public_id);

      formData.append('folder', ASSET_FOLDER);

      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          },
        }
      );

      const { secure_url: url, public_id: returnedId } = data;

      // Save lecture record
      await db.Lectures.create({
        title: title.trim() || noExt,
        url,
        publicId: returnedId,
        type: 'video',
        teacherId: user.id,
        createdAt: new Date().toISOString(),
      });

      // Reset form
      setTitle('');
      setFile(null);
      setProgress(0);
    } catch (err) {
      console.error('Upload error:', err);
      const msg = err.response?.data?.error?.message || err.message;
      setError(`Upload failed: ${msg}`);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Upload Lecture</h2>
      {error && <p style={errorStyle}>{error}</p>}
      <form onSubmit={handleSubmit} style={formGroupStyle}>
        <input
          type="text"
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lecture Title"
          required
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ ...inputStyle, padding: '8px' }}
          required
        />
        <button
          type="submit"
          style={isHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {progress > 0 ? `${progress}% Uploading...` : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default LectureUpload;
