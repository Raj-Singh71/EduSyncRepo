import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Instructor/Sidebar';
import UploadCourse from '../../components/Instructor/UploadCourse';
import ViewStudent from '../../components/Instructor/ViewStudent';
import ViewCourse from '../../components/Instructor/ViewCourse';
import InstructorQuizResults from '../../components/Instructor/InstructorQuizResults';
import CreateQuiz from '../../components/Instructor/CreateQuiz';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('uploadCourse');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <div className="container mt-4" style={{ position: 'relative', minHeight: '100vh' }}>
      <button 
        style={{ 
          position: 'absolute',
          top: '20px',
          right: '30px',
          padding: '10px 24px', 
          fontSize: '16px', 
          cursor: 'pointer', 
          color: 'white', 
          backgroundColor: '#e63946', 
          border: 'none', 
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
      <Sidebar setActiveSection={setActiveSection} />
      <div style={{ marginLeft: '240px', paddingTop: '40px' }}>
        {activeSection === 'uploadCourse' && <UploadCourse />}
        {activeSection === 'students' && <ViewStudent />}
        {activeSection === 'courses' && <ViewCourse />}
        {activeSection === 'assignments' && <InstructorQuizResults token={token} />}
        {activeSection === 'quizzes' && (
          <CreateQuiz token={token} />
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
