// Centralized configuration for the frontend
// Use import.meta.env for Vite environment variables

const getEnv = (key: string, defaultValue: string): string => {
  return (import.meta.env[key] as string) || defaultValue;
};

export const API_BASE_URL = getEnv('VITE_API_URL', 'http://localhost:8080');
export const API_V1_PATH = '/api/v1';
export const API_URL = `${API_BASE_URL}${API_V1_PATH}`;

export const CONFIG = {
  PROJECT_NAME: 'BallotBeacon AI',
  API_URL,
};
