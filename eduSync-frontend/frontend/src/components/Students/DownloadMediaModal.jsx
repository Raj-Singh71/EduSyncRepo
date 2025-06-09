import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const DownloadMediaModal = ({ courseId, show, onClose }) => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && courseId) {
      setLoading(true);
      axios.get(`${apiUrl}/courses/${courseId}/media`)
        .then(res => setMediaList(res.data))
        .finally(() => setLoading(false));
    }
  }, [show, courseId]);

  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '10px', minWidth: '300px' }}>
        <h3>Course Media</h3>
        {loading ? <p>Loading...</p> : (
          <ul>
            {mediaList.length === 0 && <li>No media files available.</li>}
            {mediaList.map(media => (
              <li key={media.id} style={{ marginBottom: '1rem' }}>
                {media.originalFileName}
                <a
                  href={`https://localhost:7244${media.filePath}`}
                  download={media.originalFileName}
                  style={{
                    marginLeft: '1rem',
                    color: '#007bff',
                    textDecoration: 'underline',
                    fontWeight: 500
                  }}
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: '#232946',
          color: '#fff',
          cursor: 'pointer'
        }}>Close</button>
      </div>
    </div>
  );
};

export default DownloadMediaModal;
