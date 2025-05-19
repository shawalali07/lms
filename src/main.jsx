import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

const centeredContainer = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: '1rem',
  backgroundColor: '#f0f4f8',
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    afterSignOutUrl="/"
  >
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route
            path="/sign-in"
            element={
              <div style={centeredContainer}>
                <SignIn routing="path" path="/sign-in" />
              </div>
            }
          />
          <Route
            path="/sign-up"
            element={
              <div style={centeredContainer}>
                <SignUp routing="path" path="/sign-up" />
              </div>
            }
          />
          <Route path="/*" element={<App />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </ClerkProvider>
);
