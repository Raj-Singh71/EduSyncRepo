import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/Students/StudentSidebar';
import AllCourses from '../../components/Students/AllCourses';
import EnrolledCourses from '../../components/Students/EnrolledCourses';
import Assessments from '../../components/Students/Assessments';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState('allCourses');

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <StudentSidebar section={section} setSection={setSection} onLogout={handleLogout} />
      <main style={{ flex: 1, padding: '2rem', background: '#f8fafc' }}>
        {section === 'allCourses' && <AllCourses />}
        {section === 'enrolledCourses' && <EnrolledCourses />}
        {section === 'assessments' && <Assessments token={token} />}
      </main>
    </div>
  );
};

export default StudentDashboard;
