import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';



export default function TeacherLayout() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col fixed h-full transition-all duration-300 hover:w-72 group shadow-sm">
        <div className="flex-1">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/teacher/dashboard"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/teacher/my-lectures"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                <span>My Lectures</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/teacher/upload"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                <span>Upload Lecture</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 transition-all duration-300 group-hover:ml-72">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-all duration-300">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}