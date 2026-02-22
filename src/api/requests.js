// all request related API calls
// all service request related API calls

import { getAPI, patchAPI } from "../lib/api";

export const getRequests    = () => getAPI("/services/requests");
export const approveRequest = (id) => patchAPI(`/services/requests/${id}/approve`);
export const rejectRequest  = (id) => patchAPI(`/services/requests/${id}/reject`);