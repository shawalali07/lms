import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVideos } from '../slices/videoSlice';
import db from '../utils/db';
import LectureCard from '../components/LectureCard';

const StudentVideos = () => {
  const dispatch = useDispatch();
  const lectures = useSelector((state) => state.videos.videos);

  useEffect(() => {
    db.Lectures.select()
      .then(({ all }) => {
        all().then((records) => {
          const lecturesData = records.map((record) => ({
            id: record.id,
            ...record.fields,
          }));
          dispatch(setVideos(lecturesData));
        });
      })
      .catch((error) => {
        console.error('Error fetching lectures:', error);
      });
  }, [dispatch]);

  return (
    <div>
      <h2>Available Lectures</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {lectures.map((lecture) => (
          <LectureCard key={lecture.id} lecture={lecture} />
        ))}
      </div>
    </div>
  );
};

export default StudentVideos;
