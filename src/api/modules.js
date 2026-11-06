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
 * @param {Object} data, config
 */
export async function createModule(data, config = {}) {
    return apiClient.post(ENDPOINTS.modules, data, config);
}


/**
 * @param {string|number} id,data
 * @param {Object} data
 */
export async function updateModule(id, data, config = {}) {
    return apiClient.patch(ENDPOINTS.moduleDetail(id), data, config);
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


export async function setModuleSchedule(moduleId, scheduleData) {
    return apiClient.put(ENDPOINTS.moduleSchedule(moduleId), scheduleData);
}