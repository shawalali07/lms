import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '../utils/db';
import {
  CircularProgress,
  Button,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const ATTEMPTS_KEY = 'quizAttempts';

const StudentQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState([]);

  // Load past attempts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(ATTEMPTS_KEY);
    if (stored) setAttempts(JSON.parse(stored));
  }, []);

  // Fetch quizzes on mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const query = await db.Quizzes.select();
        const records = await query.all();
        const parsed = records.map(rec => {
          const title     = rec.fields?.title     ?? rec.title;
          const rawQs     = rec.fields?.questions ?? rec.questions;
          const createdAt = rec.fields?.createdAt ?? rec.createdAt;
          let questions = [];
          try { questions = JSON.parse(rawQs); }
          catch { console.warn('Invalid questions JSON', rec); }
          return { id: rec.id, title, questions, createdAt };
        });
        setQuizzes(parsed);
      } catch (err) {
        console.error(err);
        setError('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) return <CircularProgress />;
  if (error)   return <Typography color="error">{error}</Typography>;

  // Start a quiz
  const startQuiz = quiz => {
    setActiveQuiz(quiz);
    setCurrentIndex(0);
    setAnswers(Array(quiz.questions.length).fill(null));
    setShowResults(false);
  };

  // Record answer
  const selectAnswer = (idx, value) => {
    const copy = [...answers];
    copy[idx] = Number(value);
    setAnswers(copy);
  };

  // Next or finish
  const nextQuestion = () => {
    if (currentIndex < activeQuiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
      // compute score
      const score = answers.reduce((sum, ans, i) =>
        sum + (ans === activeQuiz.questions[i].answer ? 1 : 0)
      , 0);
      const attempt = {
        quizId: activeQuiz.id,
        title: activeQuiz.title,
        score,
        total: activeQuiz.questions.length,
        date: new Date().toISOString()
      };
      const updated = [attempt, ...attempts];
      setAttempts(updated);
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updated));
    }
  };

  // When done, go back home
  const finishAndHome = () => {
    setActiveQuiz(null);
    navigate('/'); // redirect to home
  };

  // Render in-quiz view
  if (activeQuiz && !showResults) {
    const q = activeQuiz.questions[currentIndex];
    return (
      <Card sx={{ maxWidth: 600, m: '20px auto', p: 2 }}>
        <Typography variant="h5" gutterBottom>
          {activeQuiz.title} — Question {currentIndex + 1} / {activeQuiz.questions.length}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {q.question}
        </Typography>
        <RadioGroup
          value={answers[currentIndex] != null ? answers[currentIndex].toString() : ''}
          onChange={e => selectAnswer(currentIndex, e.target.value)}
        >
          {q.options.map((opt, j) => (
            <FormControlLabel
              key={j}
              value={j.toString()}
              control={<Radio />}
              label={opt}
            />
          ))}
        </RadioGroup>
        <Button
          variant="contained"
          onClick={nextQuestion}
          disabled={answers[currentIndex] == null}
          sx={{ mt: 2 }}
        >
          {currentIndex < activeQuiz.questions.length - 1 ? 'Next' : 'Submit'}
        </Button>
        <Button onClick={finishAndHome} sx={{ mt: 2, ml: 1 }}>
          Cancel
        </Button>
      </Card>
    );
  }

  // Render results view
  if (activeQuiz && showResults) {
    const last = attempts[0];
    return (
      <Card sx={{ maxWidth: 600, m: '20px auto', p: 2, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          You scored {last.score} / {last.total}
        </Typography>
        <Button variant="contained" onClick={finishAndHome}>
          Back to Home
        </Button>
      </Card>
    );
  }

  // Main list & previous attempts
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Available Quizzes
      </Typography>
      {quizzes.length === 0 ? (
        <Typography>No quizzes available.</Typography>
      ) : (
        quizzes.map(quiz => (
          <Card key={quiz.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6">{quiz.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                Created: {new Date(quiz.createdAt).toLocaleDateString()}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 1, textTransform: 'none' }}
                onClick={() => startQuiz(quiz)}
              >
                Take Quiz
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>
        Previous Attempts
      </Typography>
      {attempts.length === 0 ? (
        <Typography>No past attempts.</Typography>
      ) : (
        <List>
          {attempts.map((a, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={`${a.title} — ${a.score}/${a.total}`}
                secondary={new Date(a.date).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default StudentQuizzes;
