import { ENDPOINTS } from '../config/apiContract';
import apiClient from './apiClient';

export async function listModules() {
    return apiClient.get(ENDPOINTS.modules);
}

export async function getModules(id) {
    return apiClient.get(ENDPOINTS.moduleDetail(id));
}

export async function createModule(data) {
    return apiClient.post(ENDPOINTS.modules, data);
}

export async function updateModule(id, data) {
    return apiClient.put(ENDPOINTS.moduleDetail(id), data);
}

export async function deleteModule(id) {
    return apiClient.delete(ENDPOINTS.moduleDetail(id));
}

export async function listMyCreatedModules(username) {
    const all = await apiClient.get(ENDPOINTS.modules);
    return all.filter((m) => m.created_by?.username === username);
}