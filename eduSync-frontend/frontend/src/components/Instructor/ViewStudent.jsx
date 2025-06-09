import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const cardStyle = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  padding: '1.5rem',
  margin: '1rem',
  minWidth: '220px',
  maxWidth: '300px',
  flex: '1 1 250px'
};

const apiUrl = process.env.REACT_APP_API_URL;

const ViewStudent = () => {
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [enrolled, setEnrolled] = useState([]);
  const [notEnrolled, setNotEnrolled] = useState([]);

  const token = localStorage.getItem('token');
  const instructorId = token ? jwtDecode(token).userId : null;

  useEffect(() => {
    if (!instructorId) return;
    axios.get(`${apiUrl}/instructors/${instructorId}/students-overview`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setEnrolled(res.data.enrolled);
        setNotEnrolled(res.data.notEnrolled);
      })
      .catch(() => {
        setEnrolled([]);
        setNotEnrolled([]);
      });
  }, [instructorId, token]);

  const toggleDetails = (id) => {
    setExpandedStudentId(expandedStudentId === id ? null : id);
  };


  return (
    <div>
      <h2 style={{ color: '#232946', marginBottom: '1.5rem' }}>Enrolled Students</h2>
      {enrolled.length === 0 ? (
        <p>No students enrolled in any course yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {enrolled.map(student => (
            <div key={student.id + student.course} style={cardStyle}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#232946' }}>{student.name}</h4>
              <p style={{ margin: 0, color: '#61677c' }}><strong>Email:</strong> {student.email}</p>
              <p style={{ margin: 0, color: '#61677c' }}><strong>Course:</strong> {student.course}</p>
              <button
                onClick={() => toggleDetails(student.id + student.course)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#232946',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                {expandedStudentId === student.id + student.course ? 'Hide Details' : 'View Details'}
              </button>
              {expandedStudentId === student.id + student.course && (
                <div style={{ marginTop: '1rem', color: '#232946' }}>
                  
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 style={{ color: '#232946', margin: '2.5rem 0 1.5rem 0' }}>Registered (Not Enrolled in Any Course)</h2>
      {notEnrolled.length === 0 ? (

        <p>All registered students are enrolled in courses.</p>

      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {notEnrolled.map(student => (
            <div key={student.id} style={{ ...cardStyle, border: '1.5px solid #ffb703' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#232946' }}>{student.name}</h4>
              <p style={{ margin: 0, color: '#61677c' }}><strong>Email:</strong> {student.email}</p>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '0.7rem',
                  padding: '0.3rem 0.7rem',
                  background: '#ffb703',
                  color: '#fff',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: 600
                }}
              >
                Not Enrolled
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewStudent;
