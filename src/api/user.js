// all user related API calls

import { getAPI, postAPI, delAPI, patchAPI } from "../lib/api";

export const getEmployees = () => getAPI("/users?role=employee");
export const getClients   = () => getAPI("/users?role=client");
export const createUser   = (body) => postAPI("/users", body);
export const deleteUser   = (id) => delAPI(`/users/${id}`);
export const updateProfile = (body) => patchAPI("/users/profile", body);