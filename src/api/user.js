// all user related API calls

import { getAPI, postAPI, delAPI } from "../lib/api";

export const getEmployees = () => getAPI("/users?role=employee");
export const getClients = () => getAPI("/users?role=client");
export const createUser = (body) => postAPI("/users", body);
export const deleteUser = (id) => delAPI(`/users/${id}`);
export const getDeletedUsers = () => getAPI("/users?deleted=true");

// export const updateProfile = (body) => patchAPI("/users/profile", body);
export const updateProfile = (formData) =>
  fetch(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
    method: "PATCH",
    credentials: "include",
    body: formData, // no Content-Type header — browser sets it automatically with boundary
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  });
