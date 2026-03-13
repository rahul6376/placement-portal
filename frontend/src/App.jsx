import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import JobListings from './pages/JobListings';
import StudentProfile from './pages/StudentProfile';
import Auth from './pages/Auth';
import ApplicationTracker from './pages/ApplicationTracker';
import Resources from './pages/Resources';
import AdminDashboard from './pages/AdminDashboard';
import Messages from './pages/Messages';

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      {!isAuthPage && <Header />}
      
      <main className={`flex-grow ${!isAuthPage ? 'w-full' : 'w-full'}`}>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />

          {/* Protected pages (require login) */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute><JobListings /></ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute><ApplicationTracker /></ProtectedRoute>
          } />
          <Route path="/resources" element={
            <ProtectedRoute><Resources /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><StudentProfile /></ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute><Messages /></ProtectedRoute>
          } />

          {/* Admin/Coordinator only */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* 404 catch-all */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
              <p className="text-gray-500 mb-6">Page not found</p>
              <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                Go Home
              </a>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;