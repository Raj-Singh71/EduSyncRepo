import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const UploadCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert('Please fill out all required fields.');
      return;
    }

    const token = localStorage.getItem('token');
    const instructorId = token ? jwtDecode(token).userId : null;

    const formData = new FormData();
    formData.append('Name', title);
    formData.append('Description', description);
    formData.append('InstructorId', instructorId);

    // Append ALL files (not just the first one)
    files.forEach(file => {
      formData.append('Media', file);
    });

    try {
      setUploading(true);
      const response = await fetch(`${apiUrl}/courses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: Do NOT set Content-Type when sending FormData; the browser will set it, including the boundary.
        },
        body: formData,
      });

      if (response.ok) {
        alert('Course uploaded successfully!');
        setTitle('');
        setDescription('');
        setFiles([]);
      } else {
        const errorData = await response.json();
        alert('Upload failed: ' + (errorData.title || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(44,62,80,0.10)',
        padding: '2.5rem 2rem',
        maxWidth: '420px',
        margin: '2.5rem auto',
        marginLeft: '170px',
        border: '1.5px solid #e0e6ed',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
      }}
    >
      <h2
        style={{
          color: '#232946',
          marginBottom: '0.5rem',
          fontWeight: 700,
          letterSpacing: '1px',
          textAlign: 'center'
        }}
      >
        Upload a New Course
      </h2>
      <form autoComplete="off" onSubmit={handleUpload}>
        <div style={{ marginBottom: '1.1rem' }}>
          <label
            style={{
              fontWeight: 600,
              color: '#232946',
              display: 'block',
              marginBottom: '0.4rem'
            }}
          >
            Course Title
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter course title"
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              borderRadius: '7px',
              border: '1.5px solid #c7cdda',
              fontSize: '1.05rem',
              outline: 'none',
              background: '#f7f8fa',
              color: '#232946',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => (e.target.style.borderColor = '#232946')}
            onBlur={e => (e.target.style.borderColor = '#c7cdda')}
            required
          />
        </div>
        <div style={{ marginBottom: '1.1rem' }}>
          <label
            style={{
              fontWeight: 600,
              color: '#232946',
              display: 'block',
              marginBottom: '0.4rem'
            }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter course description"
            rows={4}
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              borderRadius: '7px',
              border: '1.5px solid #c7cdda',
              fontSize: '1.05rem',
              outline: 'none',
              background: '#f7f8fa',
              color: '#232946',
              resize: 'vertical',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => (e.target.style.borderColor = '#232946')}
            onBlur={e => (e.target.style.borderColor = '#c7cdda')}
            required
          />
        </div>
        <div style={{ marginBottom: '1.1rem' }}>
          <label
            style={{
              fontWeight: 600,
              color: '#232946',
              display: 'block',
              marginBottom: '0.4rem'
            }}
          >
            Upload Media / Files (optional)
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label
            htmlFor="file-upload"
            style={{
              display: 'inline-block',
              padding: '0.6rem 1.2rem',
              background: '#232946',
              color: '#fff',
              borderRadius: '7px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem',
              border: 'none',
              marginBottom: '0.3rem'
            }}
          >
            Choose File(s)
          </label>
          <div style={{ marginTop: '0.5rem', color: '#232946', fontSize: '0.98rem' }}>
            {files.length > 0 && (
              <ul style={{ paddingLeft: '1.1em', margin: 0 }}>
                {files.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            background: '#232946',
            color: '#fff',
            border: 'none',
            borderRadius: '7px',
            padding: '0.85rem 0',
            fontWeight: 700,
            letterSpacing: '1px',
            fontSize: '1.08rem',
            cursor: uploading ? 'not-allowed' : 'pointer',
            marginTop: '0.2rem',
            transition: 'background 0.2s'
          }}
          disabled={uploading}
          onMouseOver={e => (e.target.style.background = '#171a2f')}
          onMouseOut={e => (e.target.style.background = '#232946')}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default UploadCourse;
