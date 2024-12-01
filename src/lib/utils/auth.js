// src/lib/utils/auth.js

/**
 * Retrieve the authenticated user's data from localStorage.
 * @returns {Object|null} The user object or null if not found.
 */
export const getAuthenticatedUser = () => {
    const userSession = localStorage.getItem('user');
    if (userSession) {
      try {
        return JSON.parse(userSession);
      } catch (e) {
        console.error('Failed to parse user session:', e);
        return null;
      }
    }
    return null;
  };
  