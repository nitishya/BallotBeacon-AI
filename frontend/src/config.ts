const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const config = {
  API_BASE_URL,
  API_V1_STR: '/api/v1',
  ENDPOINTS: {
    TIMELINE: `${API_BASE_URL}/api/v1/timeline`,
    UPCOMING_ELECTIONS: `${API_BASE_URL}/api/v1/upcoming-elections`,
    ELIGIBILITY_CHECK: `${API_BASE_URL}/api/v1/eligibility-check`,
    ASK: `${API_BASE_URL}/api/v1/ask`,
  }
};
