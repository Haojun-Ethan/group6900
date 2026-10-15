import apiClient from "./client";
import { ENDPOINTS } from "../config/apiContract";

export async function listMyEnrollments() {
    return apiClient.get(ENDPOINTS.enrollments);
}

export async function listModuleEnrollments(moduleId) {
    return apiClient.get(ENDPOINTS.enrollments, { params: { module: moduleId     } });
}

export async function enroll(moduleId) {
    return apiClient.post(ENDPOINTS.enrollments, { module: moduleId });
}

export async function cancelEnrollment(enrollmentId) {
    return apiClient.delete(ENDPOINTS.enrollmentDetail(enrollmentId) );
}

export async function markSectionComplete(sectionID) {
    return apiClient.post(ENDPOINTS.sectionComplete(sectionID));
}