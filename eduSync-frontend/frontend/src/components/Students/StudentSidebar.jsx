import React from 'react';

const sidebarStyle = {
  width: '210px',
  background: '#232946',
  color: '#fff',
  minHeight: '100vh',
  padding: '2rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  boxShadow: '2px 0 12px rgba(0,0,0,0.08)'
};

const navButtonStyle = isActive => ({
  background: isActive ? '#eebbc3' : 'none',
  color: isActive ? '#232946' : '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '0.75rem 1rem',
  marginBottom: '0.5rem',
  fontWeight: 600,
  fontSize: '1.04rem',
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s'
});

const StudentSidebar = ({ section, setSection, onLogout }) => (
  <nav style={sidebarStyle}>
    <h2 style={{ color: '#eebbc3', marginBottom: '2rem', fontWeight: 700, fontSize: '1.5rem' }}>Student</h2>
    <button style={navButtonStyle(section === 'allCourses')} onClick={() => setSection('allCourses')}>
      All Courses
    </button>
    <button style={navButtonStyle(section === 'enrolledCourses')} onClick={() => setSection('enrolledCourses')}>
      My Courses
    </button>
    <button style={navButtonStyle(section === 'assessments')} onClick={() => setSection('assessments')}>
      Assessments
    </button>
    <div style={{ flex: 1 }} />
    <button
      style={{
        ...navButtonStyle(false),
        background: '#e63946',
        color: '#fff',
        marginTop: '2rem'
      }}
      onClick={onLogout}
    >
      Logout
    </button>
  </nav>
);

export default StudentSidebar;
