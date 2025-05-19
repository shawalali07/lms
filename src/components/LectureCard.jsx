// src/components/LectureCard.js
import React from 'react';
import cld from '../utils/cloudinary';
import { AdvancedVideo } from '@cloudinary/react';

// Utility function to extract YouTube video ID from URL
const extractYouTubeId = (url) => {
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S+[\?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match && match[1];
};

const LectureCard = ({ lecture }) => {
  // Handling YouTube video display
  if (lecture.type === 'youtube') {
    const youtubeId = extractYouTubeId(lecture.url);
    if (!youtubeId) {
      return <div style={{ padding: '1rem' }}>Invalid YouTube URL.</div>;
    }
    return (
      <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
        <h3>{lecture.title || 'Untitled Lecture'}</h3>
        <iframe
          width="100%"
          height="200"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={lecture.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Handling Cloudinary video display
  const video = cld.video(lecture.publicId).quality('auto');

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <h3>{lecture.title || 'Untitled Lecture'}</h3>
      <AdvancedVideo cldVid={video} controls style={{ width: '100%', maxHeight: '200px' }} />
    </div>
  );
};

export default LectureCard;
