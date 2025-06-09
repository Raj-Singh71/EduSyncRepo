// src/components/StudentRoute.jsx
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const StudentRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role.toLowerCase() !== 'student') {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
};

export default StudentRoute;