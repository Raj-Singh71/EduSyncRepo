import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const TakeQuiz = ({ quizId, token, studentId, onSubmit }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    axios.get(`${apiUrl}/quizzes/${quizId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setQuiz(res.data));
  }, [quizId, token]);

  const handleChange = (questionId, value) => {
    setAnswers(a => ({ ...a, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      studentId,
      answers: Object.entries(answers).map(([questionId, answerText]) => ({
        questionId: Number(questionId),
        answerText
      }))
    };
    const res = await axios.post(`${apiUrl}/quizzes/${quizId}/submit`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert(`Quiz submitted! Score: ${res.data.score}`);
    if (onSubmit) onSubmit();
  };

  if (!quiz) return <div>Loading...</div>;
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', background: '#f9f9f9', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: "#232946" }}>{quiz.title}</h2>
      <p style={{ color: "#61677c" }}>{quiz.description}</p>
      {quiz.questions.map(q => (
        <div key={q.id} style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 600, color: '#232946' }}>{q.questionText}</p>
          {q.questionType === "MCQ" ? (
            q.options.map(opt => (
              <label key={opt} style={{ display: 'block', marginBottom: 4 }}>
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={e => handleChange(q.id, e.target.value)}
                  required
                  style={{ marginRight: 8 }}
                />
                {opt}
              </label>
            ))
          ) : (
            <input
              type="text"
              value={answers[q.id] || ''}
              onChange={e => handleChange(q.id, e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          )}
        </div>
      ))}
      <button type="submit" style={{ padding: '0.7rem 2rem', borderRadius: '6px', border: 'none', backgroundColor: '#232946', color: '#fff', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
        Submit Quiz
      </button>
    </form>
  );
};

export default TakeQuiz;
