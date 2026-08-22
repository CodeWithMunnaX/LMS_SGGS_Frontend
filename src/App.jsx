import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import CertificatesPage from './pages/CertificatesPage';
import ProfilePage from './pages/ProfilePage';
import InstructorDashboardPage from './pages/InstructorDashboardPage';
import ManageCoursesPage from './pages/ManageCoursesPage';
import CourseStudioPage from './pages/CourseStudioPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Layout wrapper to conditionally render Navbar & Footer (e.g. hide footer in classroom player)
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isClassroom = location.pathname.startsWith('/learn/');

  return (
    <div className="flex flex-col min-h-screen">
      {!isClassroom && <Navbar />}
      <div className="flex-1">{children}</div>
      {!isClassroom && <Footer />}
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111827',
              color: '#F3F4F6',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600
            }
          }}
        />
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CourseCatalogPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:courseId"
              element={
                <ProtectedRoute>
                  <CoursePlayerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <CertificatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Instructor Routes */}
            <Route
              path="/instructor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <InstructorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <ManageCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/create"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <CourseStudioPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <CourseStudioPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
