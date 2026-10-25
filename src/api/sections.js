
/*https://axios-http.com/docs/api_intro */
import apiClient from './client';
import { ENDPOINTS } from '../config/apiContract';

/**
 * List sections for a module
 * @param {string|number} moduleId
 */
export async function listSections(moduleId) {
    return apiClient.get(ENDPOINTS.sections, { params: { module: moduleId } });
}

/**
 * Create a new section
 * @param {{ module: number|string, title: string, body: string, order: number }} data
 */
export async function createSection(data) {
    return apiClient.post(ENDPOINTS.sections, data);
}

/**
 * Update an existing section
 * @param {string|number} id
 * @param {Object} data
 */
export async function updateSection(id, data) {
    return apiClient.patch(ENDPOINTS.sectionDetail(id), data);
}

/**
 * Delete a section
 * @param {string|number} id
 */
export async function deleteSection(id) {
    return apiClient.delete(ENDPOINTS.sectionDetail(id));
}