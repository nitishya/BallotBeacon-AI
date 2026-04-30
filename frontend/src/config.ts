// Centralized configuration for the frontend
// Use import.meta.env for Vite environment variables

const getEnv = (key: string, defaultValue: string): string => {
  const val = import.meta.env[key] as string;
  return val !== undefined ? val : defaultValue;
};

// In dev, fallback to local backend port. In prod, fallback to empty (relative)
const defaultBaseUrl = import.meta.env.DEV ? 'http://localhost:8080' : '';
export const API_BASE_URL = getEnv('VITE_API_URL', defaultBaseUrl);
export const API_V1_PATH = '/api/v1';
export const API_URL = `${API_BASE_URL}${API_V1_PATH}`;

export const CONFIG = {
  PROJECT_NAME: 'BallotBeacon AI',
  API_URL,
};
