import React, { useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, SignIn, SignUp, useUser } from '@clerk/clerk-react';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';
import Unauthorized from './pages/Unauthorized';
import MyLectures from './pages/MyLectures';
import UploadLecture from './pages/UploadLecture';
import TeacherVideos from './pages/TeacherVideos';
import StudentVideos from './pages/StudentVideos';
import LandingPage from './components/LandingPage'; // Newly imported
import QuizUpload from './pages/QuizUpload';
import NoticeForm from './pages/NoticeForm';
import StudentNotices from './pages/StudentNotices.jsx';
import StudentQuizzes from './pages/StudentQuizzes.jsx';


const App = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    console.log('App rendered, isLoaded:', isLoaded, 'user:', user);
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <div style={styles.loading}>Loading authentication...</div>;
  }

  const role = user?.publicMetadata?.roles || [];

  return (
    <>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <NavLink to="/" style={styles.logo}>
            LMS
          </NavLink>
          <nav style={styles.nav}>
            <SignedIn>
              <div style={styles.linkGroup}>
                {role.includes('teacher') && (
                  <>
                    <NavLink to="/teacher/my-lectures" style={styles.link}>My Lectures</NavLink>
                    <NavLink to="/teacher/upload" style={styles.link}>Upload</NavLink>
                    <NavLink to="/teacher/videos" style={styles.link}>YouTube</NavLink>
                    <NavLink to="/teacher/notices" style={styles.link}>Notices</NavLink>
                    <NavLink to="/teacher/quizzes" style={styles.link}>Quizzes</NavLink>
                  </>
                )}
                {role.includes('student') && (
                  <>
                    <NavLink to="/student/videos" style={styles.link}>Videos</NavLink>
                    <NavLink to="/student/notices" style={styles.link}>Notices</NavLink>
                    <NavLink to="/student/quizzes" style={styles.link}>Quizzes</NavLink>
                  
                  </>
                )}
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <div style={styles.buttonGroup}>
                <SignInButton mode="redirect">
                  <button style={styles.signInBtn}>Sign In</button>
                </SignInButton>
                <SignUpButton mode="redirect">
                  <button style={styles.signUpBtn}>Sign Up</button>
                </SignUpButton>
              </div>
            </SignedOut>
          </nav>
        </div>
      </header>
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Updated to LandingPage */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route path="my-lectures" element={<MyLectures />} />
            <Route path="upload" element={<UploadLecture />} />
            <Route path="videos" element={<TeacherVideos />} />
            <Route path="notices" element={<NoticeForm />} />
            <Route path="quizzes" element={<QuizUpload />} />
          </Route>
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="videos" element={<StudentVideos />} />
            <Route path="notices" element={<StudentNotices />} />
            <Route path="quizzes" element={<StudentQuizzes />} />
          
          </Route>
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
        </Routes>
      </main>
    </>
  );
};

const styles = {
  loading: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '1.2rem',
  },
  header: {
    padding: '1rem 2rem',
    background: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logo: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#1e3a8a',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  linkGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#1e40af',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'color 0.2s',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem',
  },
  signInBtn: {
    padding: '0.5rem 1rem',
    background: '#1e40af',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  signUpBtn: {
    padding: '0.5rem 1rem',
    background: '#f3f4f6',
    color: '#111827',
    border: '1px solid #d1d5db',
    borderRadius: '5px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  main: {
    padding: '2rem 1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
};

export default App;