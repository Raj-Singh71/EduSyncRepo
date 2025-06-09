import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const CreateQuiz = ({ token, onQuizCreated }) => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    questionType: 'MCQ',
    options: ['', ''],
    correctAnswer: ''
  });

  useEffect(() => {
    const instructorId = token ? jwtDecode(token).userId : null;
    if (instructorId) {
      axios.get(`${apiUrl}/courses/instructor/${instructorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setCourses(res.data));
    }
  }, [token]);

  // Add current question to the questions list (even if empty)
  const addQuestionToQuiz = () => {
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      questionText: '',
      questionType: 'MCQ',
      options: ['', ''],
      correctAnswer: ''
    });
  };

  // Just clear the current question form
  const clearCurrentQuestion = () => {
    setCurrentQuestion({
      questionText: '',
      questionType: 'MCQ',
      options: ['', ''],
      correctAnswer: ''
    });
  };

  const handleOptionChange = (idx, value) => {
    const opts = [...currentQuestion.options];
    opts[idx] = value;
    setCurrentQuestion({ ...currentQuestion, options: opts });
  };

  const addOption = () => {
    setCurrentQuestion({ ...currentQuestion, options: [...currentQuestion.options, ''] });
  };

  const removeOption = (idx) => {
    const opts = currentQuestion.options.filter((_, i) => i !== idx);
    setCurrentQuestion({ ...currentQuestion, options: opts });
  };

  // Remove any question from the list (even if empty)
  const removeQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) {
      alert('Please select a course.');
      return;
    }
    if (questions.length === 0) {
      alert('Please add at least one question.');
      return;
    }
    const res = await axios.post(`${apiUrl}/quizzes`, {
      title,
      description,
      dueDate,
      courseId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const quizId = res.data.id;
    await axios.post(`${apiUrl}/quizzes/${quizId}/questions`, questions, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Quiz created successfully!');
    setTitle('');
    setDescription('');
    setDueDate('');
    setCourseId('');
    setQuestions([]);
    setCurrentQuestion({
      questionText: '',
      questionType: 'MCQ',
      options: ['', ''],
      correctAnswer: ''
    });
    if (onQuizCreated) onQuizCreated();
  };
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 700,
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#232946', marginBottom: '1.5rem' }}>Create Quiz</h2>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }}>Course</label>
      <select value={courseId} onChange={e => setCourseId(e.target.value)} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '1rem' }}>
        <option value="">Select a course</option>
        {courses.map(course => (
          <option key={course.id} value={course.id}>{course.name}</option>
        ))}
      </select>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }}>Title</label>
      <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '1rem' }} />
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }}>Description</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '1rem', minHeight: '80px' }} />
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }}>Due Date</label>
      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '1.5rem' }} />
      <hr style={{ margin: '1.5rem 0' }} />
      <h3 style={{ color: '#232946', marginBottom: '1rem' }}>Add Question</h3>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }}>Question Text</label>
      <input value={currentQuestion.questionText} onChange={e => setCurrentQuestion(q => ({ ...q, questionText: e.target.value }))} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '1rem' }} />
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }}>Type</label>
      <select value={currentQuestion.questionType} onChange={e => setCurrentQuestion(q => ({ ...q, questionType: e.target.value, options: ['',''], correctAnswer: '' }))} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '1rem' }}>
        <option value="MCQ">MCQ</option>
        <option value="ShortAnswer">Short Answer</option>
      </select>
      {currentQuestion.questionType === 'MCQ' && (
        <>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }}>Options</label>
          {currentQuestion.options.map((opt, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <input
                value={opt}
                onChange={e => handleOptionChange(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <button type="button" onClick={() => removeOption(idx)} disabled={currentQuestion.options.length <= 2} style={{ marginLeft: 8, padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', backgroundColor: '#e63946', color: '#fff', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addOption} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: '#457b9d', color: '#fff', cursor: 'pointer', marginBottom: '1rem' }}>Add Option</button>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#444' }}>Correct Answer</label>
          <input
            value={currentQuestion.correctAnswer}
            onChange={e => setCurrentQuestion(q => ({ ...q, correctAnswer: e.target.value }))}
            placeholder="Type the correct option exactly"
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '1rem' }}
          />
        </>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={addQuestionToQuiz}
          style={{ padding: '0.7rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#2a9d8f', color: '#fff', cursor: 'pointer' }}
        >
          Add to Quiz
        </button>
        <button
          type="button"
          onClick={clearCurrentQuestion}
          style={{ padding: '0.7rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#bcbcbc', color: '#232946', cursor: 'pointer' }}
        >
          Clear
        </button>
      </div>

      <hr style={{ margin: '1.5rem 0' }} />
      <h4 style={{ color: '#264653', marginBottom: '1rem' }}>Questions in Quiz: {questions.length}</h4>
      <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#264653' }}>
        {questions.map((q, i) => (
          <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ flex: 1 }}>
              {q.questionText ? `${q.questionText} (${q.questionType})` : <em style={{ color: '#e63946' }}>Empty Question</em>}
            </span>
            <button
              type="button"
              onClick={() => removeQuestion(i)}
              style={{
                marginLeft: 12,
                padding: '0.3rem 0.9rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#e63946',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button type="submit" disabled={questions.length === 0 || !courseId} style={{ padding: '0.8rem 2rem', borderRadius: '6px', border: 'none', backgroundColor: '#1d3557', color: '#fff', cursor: questions.length === 0 || !courseId ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>Create Quiz</button>
    </form>
  );
};

export default CreateQuiz;
