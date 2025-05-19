import React, { useState, useEffect } from 'react';
import db from '../utils/db';

const QuizUpload = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: 0 }]);
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // Fetch quizzes on mount
  useEffect(() => {
    const fetchData = async () => {
      const quizData = await db.Quizzes.getAll();
      setQuizzes(quizData);
    };
    fetchData();
  }, []);

  // Quiz CRUD
  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    if (field === 'question') updated[idx].question = value;
    else if (field.startsWith('option')) {
      const optIdx = Number(field.slice(-1));
      updated[idx].options[optIdx] = value;
    } else if (field === 'answer') updated[idx].answer = Number(value);
    setQuestions(updated);
  };

  const addQuestion = () => setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: 0 }]);

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    const quizData = {
      title: quizTitle,
      questions: JSON.stringify(questions),
      createdAt: new Date().toISOString(),
    };

    if (editingQuiz) {
      await db.Quizzes.update(editingQuiz.id, quizData);
      setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? { ...q, ...quizData } : q));
      setEditingQuiz(null);
    } else {
      const newQuiz = await db.Quizzes.create(quizData);
      setQuizzes([...quizzes, newQuiz]);
    }

    setQuizTitle('');
    setQuestions([{ question: '', options: ['', '', '', ''], answer: 0 }]);
  };

  const editQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setQuizTitle(quiz.title);
    setQuestions(JSON.parse(quiz.questions));
  };

  const deleteQuiz = async (id) => {
    await db.Quizzes.delete(id);
    setQuizzes(quizzes.filter(q => q.id !== id));
  };

  return (
    <div className="quiz-upload-container">
      <style>
        {`
          .quiz-upload-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
          }

          h2 {
            color: #333;
            margin: 20px 0 10px;
            font-size: 1.5rem;
          }

          .quiz-form {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .form-input, .form-select {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            box-sizing: border-box;
          }

          .question-block {
            margin-bottom: 20px;
            padding: 15px;
            background: #fff;
            border-radius: 4px;
            border: 1px solid #eee;
          }

          .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .button-group {
            display: flex;
            gap: 10px;
            margin-top: 10px;
          }

          .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            transform: scale(1);
          }

          .btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }

          .btn-primary {
            background: linear-gradient(45deg, #007bff, #00b7ff);
            color: white;
          }

          .btn-primary:hover {
            background: linear-gradient(45deg, #0056b3, #0096cc);
          }

          .btn-secondary {
            background: linear-gradient(45deg, #6c757d, #adb5bd);
            color: white;
          }

          .btn-secondary:hover {
            background: linear-gradient(45deg, #545b62, #8f959b);
          }

          .btn-small {
            padding: 8px 16px;
            font-size: 0.9rem;
          }

          .btn-edit {
            background: linear-gradient(45deg, #28a745, #34c759);
            color: white;
          }

          .btn-edit:hover {
            background: linear-gradient(45deg, #218838, #2ea44f);
          }

          .btn-delete {
            background: linear-gradient(45deg, #dc3545, #ff5767);
            color: white;
          }

          .btn-delete:hover {
            background: linear-gradient(45deg, #c82333, #e03e4c);
          }

          .quiz-list {
            display: grid;
            gap: 15px;
          }

          .quiz-item {
            background: #fff;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #eee;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .quiz-item h3 {
            margin: 0 0 10px;
            font-size: 1.2rem;
          }

          .item-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
          }

          /* Responsive design */
          @media (max-width: 600px) {
            .quiz-upload-container {
              padding: 10px;
            }

            .options-grid {
              grid-template-columns: 1fr;
            }

            .button-group {
              flex-direction: column;
            }

            .btn {
              width: 100%;
            }
          }
        `}
      </style>
      <h2>{editingQuiz ? 'Edit Quiz' : 'Create Quiz'}</h2>
      <form onSubmit={handleQuizSubmit} className="quiz-form">
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Quiz Title"
          required
          className="form-input"
        />
        {questions.map((q, i) => (
          <div key={i} className="question-block">
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(i, 'question', e.target.value)}
              placeholder={`Question #${i + 1}`}
              required
              className="form-input"
            />
            <div className="options-grid">
              {q.options.map((opt, j) => (
                <input
                  key={j}
                  type="text"
                  value={opt}
                  onChange={(e) => handleQuestionChange(i, `option${j}`, e.target.value)}
                  placeholder={`Option ${j + 1}`}
                  required
                  className="form-input"
                />
              ))}
            </div>
            <select
              value={q.answer}
              onChange={(e) => handleQuestionChange(i, 'answer', e.target.value)}
              className="form-select"
            >
              {q.options.map((_, j) => (
                <option key={j} value={j}>{`Answer ${j + 1}`}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="button-group">
          <button type="button" onClick={addQuestion} className="btn btn-secondary">Add Question</button>
          <button type="submit" className="btn btn-primary">{editingQuiz ? 'Update Quiz' : 'Save Quiz'}</button>
        </div>
      </form>

      <h2>Posted Quizzes</h2>
      <div className="quiz-list">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="quiz-item">
            <h3>{quiz.title}</h3>
            <p>Created: {new Date(quiz.createdAt).toLocaleDateString()}</p>
            <div className="item-actions">
              <button onClick={() => editQuiz(quiz)} className="btn btn-small btn-edit">Edit</button>
              <button onClick={() => deleteQuiz(quiz.id)} className="btn btn-small btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizUpload;