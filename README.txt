
LMS Frontend (React)
====================

This is a modern, futuristic Learning Management System (LMS) frontend application built with React, Tailwind CSS, Redux Toolkit, and integrated with Clerk for authentication. It supports separate dashboards for teachers and students, enabling dynamic lecture uploads, quizzes, notices, and real-time data handling via Cloudinary.

Tech Stack
----------
- React 19 with Vite
- Tailwind CSS 4
- Redux Toolkit
- Clerk Auth
- Cloudinary
- Framer Motion
- Material UI

Dependencies
------------
To install all necessary packages before running the project, run the following command:

    npm install

If you want to install dependencies individually (not necessary unless debugging):

    npm install @clerk/clerk-react @cloudinary/react @cloudinary/url-gen @emotion/react @emotion/styled @eslint/js @heroicons/react @mui/icons-material @mui/material @reduxjs/toolkit @tailwindcss/forms @tailwindcss/typography @tanstack/react-query @types/react @types/react-dom @vitejs/plugin-react autoprefixer axios cloudinary eslint-plugin-react-hooks eslint-plugin-react-refresh eslint framer-motion globals postcss react react-dom react-hook-form react-icons react-player react-redux react-router-dom tailwindcss vite yup

Getting Started
---------------
1. Clone the repository:

       git clone https://github.com/your-username/lms-frontend.git
       cd lms-frontend

2. Install dependencies:

       npm install

3. Run the project:

       npm run dev

4. Visit: http://localhost:5173

Authentication (Clerk)
----------------------
This app uses Clerk for authentication. To test the application, you can log in using the following credentials:

Teacher Login:
- Email: Teacher@gmail.com
- Password: Teacher@131220

Student Login:
- Email: Student@gmail.com
- Password: Student@131220

Make sure you have access to a valid Clerk project or mock environment for development purposes.

Media Storage
-------------
- Lecture videos, quiz images, and assets are managed via Cloudinary.

Features
--------
- Teacher Dashboard: Upload lectures (YouTube links), quizzes, and notices.
- Student Dashboard: View embedded lectures, attempt quizzes, view notices, comment.
- Role-based UI rendering.
- Fully responsive and modern design.
- Animations powered by Framer Motion.
- Secure and extendable codebase using Redux Toolkit and React Query.

Developed By
------------
Hunain Sualeh
Frontend Engineer & UI/UX Enthusiast
Passionate about building visually dynamic, interactive, and futuristic web applications using modern tools like React, Three.js, GSAP, and more.

Project Structure
-----------------
lms-frontend/
│
├── components/           # Reusable UI components
├── pages/                # Route-based pages (e.g., TeacherDashboard, StudentDashboard)
├── redux/                # Redux Toolkit slices and store
├── utils/                # Utility functions and API logic
├── assets/               # Static files
├── db.js                 # Temporary localStorage-based database logic
└── main.jsx              # Entry point

