import { Navigate } from 'react-router-dom';
// Companies.jsx — placeholder redirect to jobs page
export default function Companies() {
  return <Navigate to="/jobs" replace />;
}
