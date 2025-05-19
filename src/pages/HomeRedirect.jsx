// src/pages/HomeRedirect.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

const HomeRedirect = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }
    const roles = user?.publicMetadata?.roles || [];
    if (roles.includes('teacher')) {
      navigate('/teacher/my-lectures');
    } else if (roles.includes('student')) {
      navigate('/student/videos');
    } else {
      navigate('/unauthorized');
    }
  }, [isSignedIn, user, navigate]);

  return <div>Loading...</div>;
};

export default HomeRedirect;