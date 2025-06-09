import React from 'react';
import { Routes, Route,Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import StudentRoute from './components/Students/StudentRoute.jsx';
import StudentDashboard from './pages/dashboard/studentDashboard.jsx';
import InstructorRoute from './components/Instructor/InstructorRoute.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'
import InstructorDashboard from './pages/dashboard/InstructorDashboard.jsx';



function App() {
  return (
    <Routes>
      <Route path = "/" element={<Navigate to = "/login"/>}/>
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register />}/>
      {/* Add other routes here */}

      <Route path = "/student-dashboard" element = {<StudentRoute><StudentDashboard/></StudentRoute>}/>
            <Route path = "/instructor-dashboard" element = {<InstructorRoute><InstructorDashboard/></InstructorRoute>}/>

    </Routes>
  );
}

export default App;
