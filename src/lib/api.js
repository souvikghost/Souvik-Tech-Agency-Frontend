// export const BASE_URL = "http://54.86.144.15:9797/api";
export const BASE_URL = "http://localhost:9797/api";

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

export const getAPI = (endpoint) => request(endpoint);

export const postAPI = (endpoint, body) => request(endpoint, { method: "POST", body });

export const patchAPI = (endpoint, body) => request(endpoint, { method: "PATCH", body });

export const delAPI = (endpoint) => request(endpoint, { method: "DELETE" });