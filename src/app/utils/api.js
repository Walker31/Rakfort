import useApiConfig from '@app/stores/apiConfig';

/**
 * Generic API caller that uses the stored API base URL.
 * @param {string} path - API endpoint path.
 * @param {RequestInit} [options={}] - Fetch options.
 * @returns {Promise<Response>}
 */
export async function callApi(path, options = {}) {
  const { apiBaseUrl } = useApiConfig.getState();
  const fullUrl = `${apiBaseUrl}/api${path}`;
  return fetch(fullUrl, options);
}

/**
 * Fetches the current user's email address.
 * @returns {Promise<string|null>}
 */
export async function fetchUserEmail() {
  try {
    const response = await callApi('/user/email', { method: 'GET' });

    if (!response.ok) {
      throw new Error('Failed to fetch user email');
    }

    const data = await response.json();
    return data.email;
  } catch (error) {
    console.error('Error fetching user email:', error);
    return null;
  }
}

/**
 * Updates the evaluation author's name.
 * @param {string} evalId - The evaluation ID.
 * @param {string} author - The new author name.
 * @returns {Promise<any>}
 */
export async function updateEvalAuthor(evalId, author) {
  const response = await callApi(`/eval/${evalId}/author`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ author }),
  });

  if (!response.ok) {
    throw new Error('Failed to update eval author');
  }

  return response.json();
}
