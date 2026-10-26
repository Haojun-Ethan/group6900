import { ENDPOINTS } from '../config/apiContract';
import apiClient from './client';

/**
 * @returns {Promise<Array>}
 */
export async function listModules() {
    return apiClient.get(ENDPOINTS.modules);
}


/**
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function getModule(id) {
    return apiClient.get(ENDPOINTS.moduleDetail(id));
}


/**
 * @param {Object} data
 */
export async function createModule(data) {
    return apiClient.post(ENDPOINTS.modules, data);
}


/**
 * @param {string|number} id
 * @param {Object} data
 */
export async function updateModule(id, data) {
    return apiClient.put(ENDPOINTS.moduleDetail(id), data);
}


/**
 * @param {string|number} id
 */
export async function deleteModule(id) {
    return apiClient.delete(ENDPOINTS.moduleDetail(id));
}


/**
 * @param {string|number} id
 * @param {Object} scheduleData
 */
export async function listMyCreatedModules(username) {
    const all = await apiClient.get(ENDPOINTS.modules);
    return all.filter((m) => m.created_by?.username === username);
}