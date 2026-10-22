import apiClient from "./client";


const getResults = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};

export const getModules = async () => {
  const data = await apiClient.get("/modules/");
  return getResults(data);
};

export const getModule = async (moduleId) => {
  return apiClient.get(`/modules/${moduleId}/`);
};

export const getEnrollments = async () => {
  const data = await apiClient.get("/enrollments/");
  return getResults(data);
};

export const enrollInModule = async (moduleId) => {
  return apiClient.post("/enrollments/", {
    module: moduleId,
  });
};

export const completeSection = async (sectionId) => {
  return apiClient.post(`/sections/${sectionId}/complete/`);
};