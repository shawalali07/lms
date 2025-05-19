import React, { useState } from 'react';
import axios from 'axios';
import cld from '../utils/cloudinary';
import base from '../utils/airtable';
import { useUser } from '@clerk/clerk-react';

const UploadLectureForm = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const { user } = useUser();

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile || !title || !user) return;

    try {
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Replace with your preset

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cld.cloud.cloudName}/video/upload`,
        formData
      );
      const videoUrl = response.data.secure_url;

      await base('Lectures').create({
        title,
        url: videoUrl,
        type: 'video',
        teacherId: user.id,
        createdAt: new Date().toISOString(),
      });

      setTitle('');
      setVideoFile(null);
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
    <div>
      <h2>Upload Lecture Video</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Lecture Title"
        required
      />
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadLectureForm;