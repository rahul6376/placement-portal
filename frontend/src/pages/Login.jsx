// Login.jsx — redirects to /login which uses Auth.jsx
// This file is a stub. The actual login page is at src/pages/Auth.jsx
// which handles both login and registration.
import { Navigate } from 'react-router-dom';
export default function Login() {
  return <Navigate to="/login" replace />;
}
