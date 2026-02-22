// all service related API calls
import { getAPI, postAPI, delAPI } from "../lib/api";

export const getServices   = () => getAPI("/services");
export const createService = (body) => postAPI("/services", body);
export const deleteService = (id) => delAPI(`/services/${id}`);