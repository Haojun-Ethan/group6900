import apiClient from "./client";

// pathway basic CRUD

export async function listPathways() {
    return apiClient.get('/pathways/');
}

export async function getPathway(id) {
    return apiClient.get('/pathways/' + id + '/');
}

export async function createPathway(data) {
    // data needs name, description, module_ids
    return apiClient.post('/pathways/', data);
}

export async function updatePathway(id, data) {
    return apiClient.patch('/pathways/' + id + '/', data);
}

export async function assignPathway(id, userIds) {
    return apiClient.post(`/pathways/${id}/assign/`, { user_ids: userIds });
}