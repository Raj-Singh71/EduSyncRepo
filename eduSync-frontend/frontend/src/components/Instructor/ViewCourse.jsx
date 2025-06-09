import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const ViewCourse = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editMedia, setEditMedia] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Get instructorId from JWT
  const token = localStorage.getItem('token');
  const instructorId = token ? jwtDecode(token).userId : null;

  // Fetch instructor's courses
  const fetchCourses = () => {
    if (!instructorId) return;
    axios
      .get(`${apiUrl}/courses/instructor/${instructorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, [instructorId, token]);

  // Start editing a course
  const startEditing = (course) => {
    setEditingCourseId(course.id);
    setEditTitle(course.name);
    setEditDescription(course.description);
    setEditMedia(null); // Reset file input
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCourseId(null);
    setEditTitle('');
    setEditDescription('');
    setEditMedia(null);
  };

  // Save course updates
  const saveUpdate = async () => {
    if (!editTitle || !editDescription) {
      alert('Title and description are required.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('Name', editTitle);
      formData.append('Description', editDescription);
      if (editMedia) {
        formData.append('Media', editMedia); // Only append the current file
      }

      await axios.put(`${apiUrl}/courses/${editingCourseId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refetch the updated course list after saving
      fetchCourses();
      cancelEditing();
    } catch (err) {
      alert('Update failed.');
    }
    setUploading(false);
  };

  // Delete a course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`${apiUrl}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (err) {
      alert('Delete failed.');
    }
  };
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: "#232946", marginBottom: "1.5rem" }}>Your Uploaded Courses</h2>
      {courses.length === 0 ? (
        <p>You have not uploaded any courses yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {courses.map(course => (
            <div key={course.id} style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              padding: '1.5rem',
              minWidth: '220px',
              maxWidth: '320px',
              flex: '1 1 250px',
              position: 'relative'
            }}>
              {editingCourseId === course.id ? (
                <form onSubmit={e => { e.preventDefault(); saveUpdate(); }}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Course Title"
                    style={{
                      width: '100%',
                      marginBottom: '0.5rem',
                      padding: '0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #c7cdda'
                    }}
                    required
                  />
                  <textarea
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    placeholder="Course Description"
                    rows={3}
                    style={{
                      width: '100%',
                      marginBottom: '0.5rem',
                      padding: '0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #c7cdda'
                    }}
                    required
                  />
                  <input
                    type="file"
                    onChange={e => setEditMedia(e.target.files[0] || null)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <div>
                    <button
                      type="submit"
                      disabled={uploading}
                      style={{
                        background: '#232946',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        marginRight: '0.5rem'
                      }}
                    >
                      {uploading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      style={{
                        background: '#c7cdda',
                        color: '#232946',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h4 style={{ color: "#232946" }}>{course.name}</h4>
                  <p style={{ color: "#61677c" }}>{course.description}</p>
                  {course.mediaFiles && course.mediaFiles.length > 0 && (
                    <div>
                      <strong>Media Files:</strong>
                      <ul>
                        {course.mediaFiles.map(media => (
                          <li key={media.id}>
                            <a
                              href={`https://localhost:7244${media.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#007bff', fontSize: '0.98rem', display: 'block', marginBottom: '0.5rem' }}
                            >
                              {media.originalFileName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    onClick={() => startEditing(course)}
                    style={{
                      background: '#232946',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      marginRight: '0.7rem'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    style={{
                      background: '#e63946',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCourse;
