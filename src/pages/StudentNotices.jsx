// src/components/StudentNotices.jsx
import React, { useEffect, useState } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { Cloudinary } from '@cloudinary/url-gen';
import db from '../utils/db';

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState(null);

  // Cloudinary instance
  const cld = new Cloudinary({ cloud: { cloudName: 'deyvimtcm' } });

  useEffect(() => {
    db.Notices.select()
      .then(res => res.all())
      .then(data => {
        if (Array.isArray(data)) {
          // normalize shape
          const normalized = data.map(n => ({ id: n.id, ...n.fields }));
          // sort newest first
          normalized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setNotices(normalized);
        } else {
          setError('Fetched result is not an array');
        }
      })
      .catch(err => {
        console.error('Error fetching notices:', err);
        setError('Failed to fetch notices');
      });
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', color: '#eee', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#000000' }}>Notices</h2>
      {error && <p style={{ color: 'salmon' }}>{error}</p>}
      {notices.length === 0
        ? <p style={{ textAlign: 'center', color: '#000000' }}>No notices available</p>
        : notices.map(n => (
            <div
              key={n.id}
              style={{
                background: '#1c1c1e',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: 8,
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>
                {new Date(n.createdAt).toLocaleString()}
              </div>
              <p style={{ marginBottom: 12 }}>{n.content}</p>
              {n.imagePublicId && (
                <AdvancedImage
                  cldImg={cld.image(n.imagePublicId).resize(fill().width(600).height(360))}
                  style={{ width: '100%', borderRadius: 6 }}
                  alt="Notice"
                />
              )}
            </div>
          ))
      }
    </div>
  );
};

export default StudentNotices;
