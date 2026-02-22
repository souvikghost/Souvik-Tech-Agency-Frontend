// login, logout, me
import { getAPI, postAPI } from "../lib/api";

export const getMe     = () => getAPI("/auth/me");
export const login     = (body) => postAPI("/auth/login", body);
export const logout    = () => postAPI("/auth/logout");