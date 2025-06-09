import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const InstructorQuizResults = ({ token }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const instructorId = token ? jwtDecode(token).userId : null;

  useEffect(() => {
    if (!instructorId) return;
    setLoading(true);
    axios.get(`${apiUrl}/instructor/${instructorId}/quizzes-with-results`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setQuizzes(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [instructorId, token]);

  if (loading) return <p>Loading quiz results...</p>;
  if (!loading && quizzes.length === 0) return <p>No quizzes or results found.</p>;



  return (
    <div>
      <h2>Quiz Results</h2>
      {quizzes.map(quiz => (
        <div key={quiz.id} style={{ marginBottom: "2rem" }}>
          <h4>{quiz.title} <span style={{ color: "#61677c" }}>({quiz.course})</span></h4>
          {quiz.submissions.length === 0 ? (
            <div style={{ color: "#61677c" }}>No submissions yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
              <thead>
                <tr style={{ background: "#e0e7ff" }}>
                  <th style={{ padding: "0.5rem" }}>Student</th>
                  <th style={{ padding: "0.5rem" }}>Submitted At</th>
                  <th style={{ padding: "0.5rem" }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {quiz.submissions.map(sub => (
                  <tr key={sub.studentId}>
                    <td style={{ padding: "0.5rem" }}>{sub.studentName}</td>
                    <td style={{ padding: "0.5rem" }}>{new Date(sub.submittedAt).toLocaleString()}</td>
                    <td style={{ padding: "0.5rem", fontWeight: 600 }}>{sub.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default InstructorQuizResults;
