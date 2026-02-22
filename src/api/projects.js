// all project related API calls

import { delAPI, getAPI, patchAPI } from "../lib/api";

export const getProjects = () => getAPI("/projects");
export const updateProjectStatus = (id, status) => patchAPI(`/projects/${id}/status`, { status });
export const assignEmployees      = (id, employees) => patchAPI(`/projects/${id}/assign`, { employees });
export const updateProject        = (id, data) => patchAPI(`/projects/${id}`, data);
export const deleteProject        = (id) => delAPI(`/projects/${id}`);