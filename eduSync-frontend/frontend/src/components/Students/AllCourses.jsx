import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolling, setEnrolling] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token).userId : null;

  useEffect(() => {
    // Fetch all courses
    axios.get(`${apiUrl}/courses`)
      .then(res => setCourses(res.data))
      .catch(err => {
        console.error('Failed to fetch courses:', err);
        setCourses([]);
      });

    // Fetch enrolled courses for this student
    if (userId) {
      axios.get(`${apiUrl}/enrollments/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          // Ensure IDs are numbers for reliable comparison
          const ids = res.data.map(course => Number(course.id));
          setEnrolledCourseIds(ids);
        })
        .catch(() => setEnrolledCourseIds([]));
    }
  }, [userId, token]);

  const handleEnroll = async (courseId) => {
    if (!userId) {
      alert('User not authenticated.');
      return;
    }
    setEnrolling(courseId);
    try {
      await axios.post(`${apiUrl}/enrollments`,
        { userId, courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Enrolled successfully!');
      setEnrolledCourseIds(prev => [...prev, Number(courseId)]);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert('You are already enrolled in this course.');
      } else {
        alert('Enrollment failed. Please try again.');
      }
    }
    setEnrolling(null);
  };
  return (
    <div>
      <h2 style={{ color: "#232946", marginBottom: "1.5rem" }}>All Courses</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {courses.map(course => (
          <div key={course.id} style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            padding: '1.5rem',
            minWidth: '220px',
            maxWidth: '300px',
            flex: '1 1 250px'
          }}>
            <h4 style={{ color: "#232946" }}>{course.name}</h4>
            <p style={{ color: "#61677c" }}>{course.description}</p>
            {enrolledCourseIds.includes(Number(course.id)) ? (
              <button
                disabled
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#c7cdda',
                  color: '#232946',
                  cursor: 'not-allowed'
                }}
              >
                Enrolled
              </button>
            ) : (
              <button
                onClick={() => handleEnroll(course.id)}
                disabled={enrolling === course.id}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#232946',
                  color: '#fff',
                  cursor: enrolling === course.id ? 'not-allowed' : 'pointer'
                }}
              >
                {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCourses;
