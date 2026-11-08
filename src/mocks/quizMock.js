// Fake quiz backend shared by demo mode (src/api/demoAdapter.js) and MSW (src/mocks/handlers.js).
// Responses use the backend's snake_case shapes; client.js converts them to camelCase as usual.
import { MOCK_QUIZ_QUESTIONS } from '../pages/quizzes/_mockQuizData';

// The backend only supports these two types.
const QUESTIONS = MOCK_QUIZ_QUESTIONS.filter((q) => ['SINGLE', 'MULTIPLE'].includes(q.question_type));
const PASS_MARK = 80;

const attempts = new Map();
let nextAttemptId = 1;

/** GET /questions/?module=  (owner view, includes is_correct) */
export const listQuestions = (moduleId) =>
  QUESTIONS.map((q) => ({ ...q, module: Number(moduleId) || 1, is_active: true }));

/** Learner view of a question: no answer key. */
const learnerQuestion = (q) => ({
  id: q.id,
  text: q.text,
  question_type: q.question_type,
  points: q.points,
  choices: q.choices.map((c) => ({ id: c.id, text: c.text })),
});

const serialize = (a) => ({
  id: a.id,
  module: a.module,
  module_title: 'Demo Module',
  username: 'demo_user',
  started_at: a.started_at,
  expires_at: null,
  submitted_at: a.submitted_at,
  score_percent: a.score_percent,
  pass_mark: PASS_MARK,
  passed: a.passed,
  questions: a.submitted_at ? null : QUESTIONS.map(learnerQuestion),
  results: a.submitted_at ? a.results : null,
});

/** POST /attempts/  -> resumes the open attempt for the module, if any */
export const startAttempt = (moduleId) => {
  const module = Number(moduleId) || 1;
  const open = [...attempts.values()].find((a) => a.module === module && !a.submitted_at);
  if (open) return { status: 200, body: serialize(open) };

  const attempt = { id: nextAttemptId++, module, started_at: new Date().toISOString(), submitted_at: null };
  attempts.set(attempt.id, attempt);
  return { status: 201, body: serialize(attempt) };
};

/** POST /attempts/:id/submit/  body: { answers: [{ question, choices }] } — all-or-nothing per question */
export const submitAttempt = (attemptId, body) => {
  const attempt = attempts.get(Number(attemptId));
  if (!attempt) return { status: 404, body: { detail: 'Not found.' } };
  if (attempt.submitted_at) return { status: 400, body: ['This attempt has already been submitted.'] };

  const picked = Object.fromEntries((body?.answers || []).map((a) => [a.question, new Set(a.choices)]));
  let total = 0;
  let awarded = 0;

  attempt.results = QUESTIONS.map((q) => {
    const correct = new Set(q.choices.filter((c) => c.is_correct).map((c) => c.id));
    const selected = picked[q.id] || new Set();
    const isCorrect = selected.size === correct.size && [...selected].every((id) => correct.has(id));

    total += q.points;
    if (isCorrect) awarded += q.points;

    return {
      question: q.text,
      selected_choices: [...selected],
      is_correct: isCorrect,
      points_awarded: isCorrect ? q.points : 0,
      explanation: q.explanation || '',
    };
  });

  const score = total ? Math.round((awarded * 10000) / total) / 100 : 0;
  attempt.submitted_at = new Date().toISOString();
  attempt.score_percent = score.toFixed(2);
  attempt.passed = score >= PASS_MARK;

  return { status: 200, body: serialize(attempt) };
};

/** GET /attempts/:id/ */
export const getAttempt = (attemptId) => {
  const attempt = attempts.get(Number(attemptId));
  return attempt ? { status: 200, body: serialize(attempt) } : { status: 404, body: { detail: 'Not found.' } };
};
