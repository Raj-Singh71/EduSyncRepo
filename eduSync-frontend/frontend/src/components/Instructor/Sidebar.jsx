import React, { useState } from 'react';

const Sidebar = ({ setActiveSection }) => {
  const [open, setOpen] = useState(false);

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: open ? 0 : '-220px',
    width: '220px',
    height: '100vh',
    background: '#232946',
    color: '#fff',
    padding: '2rem 1rem',
    transition: 'left 0.3s',
    zIndex: 1000,
    boxShadow: open ? '2px 0 12px rgba(0,0,0,0.1)' : 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.2)',
    zIndex: 999,
    display: open ? 'block' : 'none',
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: '#fff',
    width: '100%',
    textAlign: 'left',
    padding: '0.75rem 0',
    fontWeight: 'bold',
    cursor: 'pointer'
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            zIndex: 1100,
            background: '#232946',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}
        >
          Dashboard
        </button>
      )}

      {open && <div style={overlayStyle} onClick={() => setOpen(false)}></div>}

      <nav style={sidebarStyle}>
        <button
          onClick={() => setOpen(false)}
          style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            marginBottom: '2rem',
            cursor: 'pointer'
          }}
          aria-label="Close Sidebar"
        >
          &times;
        </button>
        <h2 style={{ color: '#eebbc3', marginBottom: '2rem', fontWeight: 700 }}>Dashboard</h2>
        <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
          <li>
            <button
              onClick={() => { setActiveSection('uploadCourse'); setOpen(false); }}
              style={buttonStyle}
            >
              Upload Course
            </button>
          </li>
          <li>
            <button
              onClick={() => { setActiveSection('students'); setOpen(false); }}
              style={buttonStyle}
            >
              View Students
            </button>
          </li>
          <li>
            <button
              onClick={() => { setActiveSection('courses'); setOpen(false); }}
              style={buttonStyle}
            >
              View Courses
            </button>
          </li>
          <li>
            <button
              onClick={() => { setActiveSection('assignments'); setOpen(false); }}
              style={buttonStyle}
            >
              View Assignments
            </button>
          </li>
          <li>
            <button
              onClick={() => { setActiveSection('quizzes'); setOpen(false); }}
              style={buttonStyle}
            >
              Create Quiz
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
