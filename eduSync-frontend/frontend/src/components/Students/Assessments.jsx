import React, { useEffect, useState } from 'react';
import TakeQuiz from './TakeQuiz';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const Assessments = ({ token }) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuizId, setActiveQuizId] = useState(null);

  const studentId = token ? jwtDecode(token).userId : null;

  const fetchAssessments = () => {
    if (!studentId) return;
    setLoading(true);
    axios.get(`${apiUrl}/student/${studentId}/quizzes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setAssessments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAssessments();
    // eslint-disable-next-line
  }, [studentId, token]);

  if (loading) return <p>Loading assessments...</p>;

  if (activeQuizId) {
    return (
      <TakeQuiz
        quizId={activeQuizId}
        token={token}
        studentId={studentId}
        onSubmit={() => {
          setActiveQuizId(null);
          fetchAssessments(); // Refresh list after submission
        }}
      />
    );
  }
  return (
    <div>
      <h2 style={{ color: "#232946", marginBottom: "1.5rem" }}>Quizzes & Assessments</h2>
      {assessments.length === 0 ? (
        <p>No quizzes available for your courses yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {assessments.map(quiz => (
            <div key={quiz.id} style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              padding: '1.5rem',
              minWidth: '220px',
              maxWidth: '300px',
              flex: '1 1 250px'
            }}>
              <div style={{
                background: '#e0e7ff',
                color: '#232946',
                padding: '0.25rem 0.7rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.95rem',
                marginBottom: '0.5rem'
              }}>
                {quiz.course}
              </div>
              <h4 style={{ color: "#232946" }}>{quiz.title}</h4>
              <p style={{ color: "#61677c" }}>
                Status: <strong>{quiz.status}</strong>
                {quiz.status === "Completed" && quiz.score !== null && (
                  <span style={{ color: "#198754", marginLeft: 8 }}>
                    | Score: {quiz.score}%
                  </span>
                )}
              </p>
              {quiz.status !== "Completed" ? (
                <button
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#232946',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => setActiveQuizId(quiz.id)}
                >
                  {quiz.status === "Not Started" ? "Start" : "Continue"}
                </button>
              ) : (
                <button
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#198754',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => alert(`View results for: ${quiz.title}`)}
                >
                  View Result
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assessments;
