import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - Redirects unauthenticated users to /login.
 * Optionally restricts access by role (allowedRoles array).
 * 
 * Usage:
 *   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 *   <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN','COORDINATOR']}><AdminDashboard /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole')?.toUpperCase() || '';

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
