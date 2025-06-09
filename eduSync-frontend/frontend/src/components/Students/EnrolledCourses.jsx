import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get JWT token and decode userId
  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token).userId : null;

  useEffect(() => {
    if (!userId) {
      setCourses([]);
      setLoading(false);
      return;
    }
    axios.get(`${apiUrl}/enrollments/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setCourses(res.data))
      .catch(err => {
        console.error('Failed to fetch enrolled courses:', err);
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, [userId, token]);

  if (loading) return <p>Loading your courses...</p>;

  return (
    <div>
      <h2 style={{ color: "#232946", marginBottom: "1.5rem" }}>My Courses</h2>
      {courses.length === 0 ? (
        <p>You are not enrolled in any courses yet.</p>
      ) : (
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
              {/* Media files list */}
              {course.mediaFiles && course.mediaFiles.length > 0 ? (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Media Files:</strong>
                  <ul>
                    {course.mediaFiles.map(media => (
                      <li key={media.id}>
                        <a
                          href={`https://localhost:7244${media.filePath}`}
                          download={media.originalFileName}
                          style={{
                            color: '#007bff',
                            textDecoration: 'underline',
                            marginRight: '1rem'
                          }}
                        >
                          {media.originalFileName}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ marginTop: '1rem', color: '#888' }}>
                  No media files available.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
