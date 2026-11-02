<<<<<<< HEAD
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

export async function setModuleSchedule(moduleId, scheduleData) {
    return apiClient.put(ENDPOINTS.moduleSchedule(moduleId), scheduleData);
}
=======

import apiClient from "./client";

const USE_DEMO = import.meta.env.VITE_MODULES_DEMO === "true";

const DEMO_MODULES = [
  {
    id: 1,
    title: "Phishing Awareness",
    summary: "Learn to identify phishing attacks.",
    sections: [
      {
        id: 101,
        title: "Introduction to Phishing",
        body: "Learn how phishing attacks work.",
        order: 1,
      },
      {
        id: 102,
        title: "Identifying Threats",
        body: "Recognise suspicious emails and links.",
        order: 2,
      },
    ],
  },
  {
    id: 2,
    title: "Password Security",
    summary: "Protect your online accounts.",
    sections: [
      {
        id: 201,
        title: "Password Fundamentals",
        body: "Learn how to create strong passwords.",
        order: 1,
      },
    ],
  },
];

export const getModules = async () => {
  if (USE_DEMO) {
    return DEMO_MODULES;
  }

  const data = await apiClient.get("/modules/");
  return Array.isArray(data) ? data : data.results ?? [];
};
 

export const getModule = async (id) => {
  if (USE_DEMO) {const module = DEMO_MODULES.find(
      (item) => item.id === Number(id));

    if (!module) {
      throw new Error("Module not found");
    }

    return module;
  }

  return apiClient.get(`/modules/${id}/`);
};



export const getEnrollments = async () => {
  if (USE_DEMO) { return DEMO_MODULES.map((module) => ({
      module: module.id,
    }));
  }

  const data = await apiClient.get("/enrollments/");
  return Array.isArray(data) ? data : data.results ?? [];
};

 
console.log("Modules Demo Mode:", USE_DEMO);






/* for the backend API, not used for demo mode
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
*/
>>>>>>> 4a6f1238ae581daeababb7579a7cef7553e975f6
