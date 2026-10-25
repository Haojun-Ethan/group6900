
/**
 * List question for a module
 * @param {string | number} moduleId
 */

import apiClient from "./client";

export async function listQuestions(moduleId) {
    return apiClient.get(`/modules/${moduleId}/questions/`);
}

/**
 * Start a  quiz attempt
 * @param {string | number} moduleId
 * @returns {Promise <{id:number, moduleId:number, startedAt: string}>} 
*/

export async function startQuiz(moduleId) {
    return apiClient.post(`/modules/${moduleId}/attempts/`);
}


/**
 * Submit quiz answer and evaluate score
 * @param {string | number} attemptId
 * @param {Object} answer
 * @returns {Promise<{id: number, scorePercent: number, passed: boolean, userAnswers: Object} >}
 */
export async function submitQuiz(attemptId, answers) {
    return apiClient.post(`/attempts/${attemptId}/submit/`, { answers });
    
}


/**
 * Get attempt review details
 * @param {string|number} attemptId
 */
export async function getAttempt(attemptId) {
    return apiClient.get(`/attempts/${attemptId}/`);
}