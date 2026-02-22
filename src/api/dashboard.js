// dashboard related API calls

import { getAPI } from "../lib/api";

export const getDashboard = () => getAPI("/dashboard");