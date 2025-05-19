// src/layouts/StudentLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const StudentLayout = () => {
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
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          style={{
            ...styles.menuButton,
            ...(isOpen ? styles.menuButtonActive : {}),
          }}
        >
          <div style={styles.burgerLine} />
          <div style={styles.burgerLine} />
          <div style={styles.burgerLine} />
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
                width: '75vw',
                maxWidth: 300,
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(144, 202, 249, 0.85)',
                boxShadow: '0 8px 24px rgba(13, 71, 161, 0.3)',
                borderRadius: '0 0 8px 0',
                transform: isOpen ? 'translateX(0)' : 'translateX(-110%)',
                transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1100,
              }
            : {
                boxShadow: '2px 0 10px rgba(13, 71, 161, 0.1)',
              }),
        }}
        aria-label="Student navigation"
      >
        <h2 style={styles.heading}>Student Portal</h2>
        <ul style={styles.navList}>
          {[
            { to: '/student/videos', label: 'Video Library' },
            { to: '/student/notices', label: 'Notices' },
            { to: '/student/quizzes', label: 'Quizzes' },
          ].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
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
        tabIndex={-1}
      >
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f7f9fc',
    fontFamily: "'Inter', sans-serif",
    color: '#0d47a1',
  },
  menuButton: {
    position: 'fixed',
    top: 20,
    left: 20,
    width: 32,
    height: 24,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 1200,
    transition: 'transform 0.3s ease',
  },
  menuButtonActive: {
    transform: 'rotate(90deg)',
  },
  burgerLine: {
    width: 32,
    height: 4,
    backgroundColor: '#0d47a1',
    borderRadius: 2,
    transition: 'background-color 0.3s ease',
  },
  sidebar: {
    flex: '0 0 250px',
    maxWidth: 250,
    width: '100%',
    padding: '2.5rem 2rem',
    background: 'linear-gradient(135deg, #e3f2fd, #90caf9)',
    borderRight: '1px solid rgba(13, 71, 161, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    marginBottom: '2rem',
    fontSize: '1.875rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: '#0d47a1',
    userSelect: 'none',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  link: {
    display: 'block',
    padding: '0.85rem 1.5rem',
    borderRadius: '12px',
    color: '#1e3a8a',
    backgroundColor: 'transparent',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1.125rem',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 0 0 0 transparent',
  },
  active: {
    backgroundColor: '#bbdefb',
    color: '#0d47a1',
    fontWeight: 700,
    boxShadow:
      '0 0 8px 2px rgba(13, 71, 161, 0.6), inset 0 0 10px 1px rgba(13, 71, 161, 0.3)',
  },
  main: {
    flex: '1 1 0',
    padding: '2.5rem 3rem',
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 0 30px rgba(0,0,0,0.03)',
    borderRadius: 12,
    margin: '2rem',
    minHeight: 'calc(100vh - 4rem)',
    overflowY: 'auto',
  },
};

export default StudentLayout;
