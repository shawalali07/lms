// src/pages/TeacherVideos.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addVideo } from '../slices/videoSlice';
import { useUser } from '@clerk/clerk-react';
import db from '../utils/db';

const TeacherVideos = () => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const { user } = useUser();

  const onSubmit = async ({ url, title }) => {
    if (!user) return;
    try {
      const record = await db.Lectures.create({
        title: title || 'YouTube Lecture',
        url,
        type: 'youtube',
        teacherId: user.id,
        createdAt: new Date().toISOString(),
      });
      dispatch(
        addVideo({
          id: record.id,
          url,
          title: title || 'YouTube Lecture',
          type: 'youtube',
        })
      );
      reset();
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📹 Add YouTube Lecture</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <input
          {...register('url', { required: true })}
          placeholder="YouTube URL"
          style={styles.input}
        />
        <input
          {...register('title')}
          placeholder="Title (optional)"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          ➕ Add
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#343a40',
    marginBottom: '25px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '12px 16px',
    backgroundColor: '#0d6efd',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default TeacherVideos;
