// src/pages/ClassForm.js
import React, { useState, useEffect } from 'react';
import db from '../utils/db';

const ClassForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const data = await db.Classes.findMany();
    setClasses(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await db.Classes.update(editingId, {
        name,
        description,
      });
      setEditingId(null);
    } else {
      await db.Classes.create({
        name,
        description,
        createdAt: new Date().toISOString(),
      });
    }

    setName('');
    setDescription('');
    fetchClasses();
  };

  const handleEdit = (cls) => {
    setEditingId(cls.id);
    setName(cls.name);
    setDescription(cls.description);
  };

  const handleDelete = async (id) => {
    await db.Classes.delete(id);
    fetchClasses();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{editingId ? '✏️ Edit Class' : '➕ Add Class'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Class Name"
          required
          style={styles.input}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>
          {editingId ? 'Update' : 'Create'}
        </button>
      </form>

      <div style={styles.listContainer}>
        <h3 style={styles.subHeading}>📚 Existing Classes</h3>
        {classes.length === 0 ? (
          <p style={styles.empty}>No classes yet.</p>
        ) : (
          classes.map((cls) => (
            <div key={cls.id} style={styles.card}>
              <div>
                <h4 style={styles.cardTitle}>{cls.name}</h4>
                <p style={styles.cardDesc}>{cls.description}</p>
              </div>
              <div style={styles.actions}>
                <button onClick={() => handleEdit(cls)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(cls.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#f1f3f5',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#212529',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '30px',
  },
  input: {
    padding: '12px 16px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #adb5bd',
    outline: 'none',
  },
  textarea: {
    padding: '12px 16px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #adb5bd',
    minHeight: '80px',
    resize: 'vertical',
    outline: 'none',
  },
  button: {
    padding: '12px 16px',
    backgroundColor: '#0d6efd',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  listContainer: {
    marginTop: '20px',
  },
  subHeading: {
    color: '#495057',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  empty: {
    textAlign: 'center',
    color: '#6c757d',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: '15px 20px',
    borderRadius: '10px',
    marginBottom: '15px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    margin: 0,
    fontSize: '17px',
    color: '#212529',
  },
  cardDesc: {
    margin: '5px 0 0',
    color: '#495057',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: '#ffc107',
    border: 'none',
    borderRadius: '6px',
    color: '#212529',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default ClassForm;
