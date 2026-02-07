/**
 * API client for backend communication
 */

import { API_URL } from "../config";

const TOKEN_KEY = "FILLIN_PROJECT_NAME_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Make an API request
 */
export async function apiRequest(action, payload = {}, requireAuth = true) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (requireAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}/api`, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, payload }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// Keep old name for backward compat with home.jsx ping
export const apiCall = (action, payload = {}, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(`${API_URL}/api`, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, payload }),
  }).then((r) => r.json().then((data) => {
    if (!r.ok) throw new Error(data.error || "Request failed");
    return data;
  }));
};

// Auth API
export const authApi = {
  getGoogleAuthUrl: () => apiRequest("googleAuthUrl", {}, false),
  googleCallback: (code) => apiRequest("googleCallback", { code }, false),
  getMe: () => apiRequest("getMe"),
};
