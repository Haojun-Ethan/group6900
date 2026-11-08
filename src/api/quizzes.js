import apiClient from "./client";

/*
 * Quiz API, matching the Django backend (quizzes app).
 *
 * client.js converts keys automatically: send camelCase, receive camelCase.
 *
 * Owners / admins (answer key included):
 *   GET    /questions/?module=<id>
 *   POST   /questions/          { module, text, questionType, explanation, points, order, isActive,
 *                                 choices: [{ text, isCorrect, order }] }
 *   PATCH  /questions/<id>/     same body; choices with an id are updated, without an id are created,
 *                               and any choice left out is deleted
 *   DELETE /questions/<id>/     (questions used in past attempts are deactivated instead)
 *
 * Learners (answer key never sent):
 *   POST   /attempts/               { module } -> starts an attempt, or resumes the one in progress
 *   POST   /attempts/<id>/submit/   { answers: [{ question, choices: [choiceId, ...] }] }
 *   GET    /attempts/<id>/          questions while in progress, results once submitted
 */

// ---------- Owner: question bank ----------

/**
 * @param {string|number} moduleId
 * @returns {Promise<Array>} questions with choices (including isCorrect)
 */
export async function listQuestions(moduleId) {
    return apiClient.get('/questions/', { params: { module: moduleId } });
}

/** @param {Object} data question with nested choices */
export async function createQuestion(data) {
    return apiClient.post('/questions/', data);
}

/**
 * @param {string|number} id
 * @param {Object} data question with nested choices
 */
export async function updateQuestion(id, data) {
    return apiClient.patch(`/questions/${id}/`, data);
}

/** @param {string|number} id */
export async function deleteQuestion(id) {
    return apiClient.delete(`/questions/${id}/`);
}

// ---------- Learner: attempts ----------

/**
 * Start an attempt, or resume the one already in progress.
 * @param {string|number} moduleId
 * @returns {Promise<{id: number, module: number, startedAt: string, expiresAt: string|null,
 *   passMark: number, questions: Array<{id: number, text: string, questionType: string, points: number,
 *   choices: Array<{id: number, text: string}>}>}>}
 */
export function startAttempt(moduleId) {
    // Share one request per module while it is in flight. React StrictMode runs effects twice in
    // development, and two simultaneous POSTs could otherwise create two attempts and use up
    // the module's attempt limit.
    const key = String(moduleId);

    if (!pendingStarts.has(key)) {
        const request = apiClient
            .post('/attempts/', { module: Number(moduleId) })
            .finally(() => pendingStarts.delete(key));
        pendingStarts.set(key, request);
    }

    return pendingStarts.get(key);
}

const pendingStarts = new Map();

/**
 * @param {string|number} attemptId
 * @param {Array<{question: number, choices: number[]}>} answers
 * @returns {Promise<Object>} the graded attempt, with scorePercent, passed and results
 */
export async function submitAttempt(attemptId, answers) {
    return apiClient.post(`/attempts/${attemptId}/submit/`, { answers });
}

/**
 * A learner's own attempt, or (for module owners / admins) any attempt in a module they manage.
 * @param {string|number} attemptId
 */
export async function getAttempt(attemptId) {
    return apiClient.get(`/attempts/${attemptId}/`);
}

// ---------- Owner: gradebook ----------

/**
 * One row per enrolled learner in the modules I manage: compliance status, section progress,
 * and attemptsCount / bestScore / latestScore / latestPassed / latestAttemptId / latestSubmittedAt.
 * @param {string|number} [moduleId] limit to one module
 */
export async function getGradebook(moduleId) {
    return apiClient.get('/gradebook/', moduleId ? { params: { module: moduleId } } : undefined);
}
