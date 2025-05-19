// src/layouts/TeacherLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const TeacherLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const toggleMenu = () => setIsOpen((o) => !o);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = width <= 768;

  return (
    <div style={styles.container}>
      {isMobile && (
        <button onClick={toggleMenu} style={styles.menuButton}>
          ☰
        </button>
      )}

      <nav
        style={{
          ...styles.sidebar,
          ...(isMobile
            ? {
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease',
                zIndex: 1000,
              }
            : {}),
        }}
      >
        <h2 style={styles.heading}>Teacher Portal</h2>
        <ul style={styles.navList}>
          {[
            { path: '/teacher/my-lectures', label: 'My Lectures' },
            { path: '/teacher/upload',     label: 'Upload Lecture' },
            { path: '/teacher/videos',     label: 'Add YouTube Video' },
            { path: '/teacher/notices',    label: 'Post Notices' },
            { path: '/teacher/quizzes',    label: 'Create Quizzes' },
          ].map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                style={({ isActive }) => ({
                  ...styles.link,
                  ...(isActive ? styles.active : {}),
                })}
                onClick={() => isMobile && toggleMenu()}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main
        style={styles.main}
        onClick={() => isMobile && isOpen && toggleMenu()}
      >
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: '100vh',
    backgroundColor: '#f7f8fa',
  },
  menuButton: {
    position: 'fixed',
    top: 16,
    left: 16,
    fontSize: 24,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1100,
    color: '#0d47a1',
  },
  sidebar: {
    flex: '0 0 250px',
    maxWidth: '250px',
    width: '100%',
    padding: '2rem 1.5rem',
    background: 'linear-gradient(135deg, #e3f2fd, #90caf9)',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  heading: {
    marginBottom: '1.5rem',
    color: '#0d47a1',
    fontSize: '1.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  link: {
    display: 'block',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    color: '#1e3a8a',
    backgroundColor: 'transparent',
    textDecoration: 'none',
    fontWeight: 400,
    transition: 'background-color 0.3s ease',
  },
  active: {
    backgroundColor: '#bbdefb',
    color: '#0d47a1',
    fontWeight: 600,
  },
  main: {
    flex: '1 1 0',
    padding: '2rem',
    width: '100%',
  },
};

export default TeacherLayout;
