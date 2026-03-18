const API_BASE = import.meta.env.VITE_API_URL || 'https://aioptimizer-api-production.up.railway.app/api';

let authToken = localStorage.getItem('authToken');

export function clearToken() {
  authToken = null;
  localStorage.removeItem('authToken');
}

export function setToken(token: string) {
  authToken = token;
  localStorage.setItem('authToken', token);
}

export function getToken() {
  return authToken;
}

async function request(method: string, path: string, body?: object) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Auth
export const login = (email: string, password: string) =>
  request('POST', '/auth/login', { email, password });

export const signup = (name: string, email: string, password: string) =>
  request('POST', '/auth/signup', { name, email, password });

export const forgotPassword = (email: string) =>
  request('POST', '/auth/forgot-password', { email });

export const resetPassword = (token: string, newPassword: string) =>
  request('POST', '/auth/reset-password', { token, newPassword });

// Dashboard
export const getDashboard = (duration = '30') =>
  request('GET', `/dashboard?duration=${duration}`);

// Drilldown
export const getDrilldown = (type: string, duration = '30') =>
  request('GET', `/drilldown?type=${type}&duration=${duration}`);

// API Keys
export const getKeys = () => request('GET', '/keys');
export const addKey = (provider: string, keyName: string, key: string) =>
  request('POST', '/keys', { provider, keyName, key });
export const deleteKey = (id: string) => request('DELETE', `/keys/${id}`);

// Alerts
export const getAlerts = () => request('GET', '/alerts');
export const markAlertRead = (id: string) => request('POST', `/alerts/${id}/read`);
