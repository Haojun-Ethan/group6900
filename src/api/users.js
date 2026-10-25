
import apiClient from "./client";

// waitting backend to implement the API endpoints for users


/**
 * Get the list of all users (Admin only)
 * @returns {Promise<Array>}
 */
export async function listUsers( ) {
  return apiClient.get('/accounts/user/')

}

/**
 * Update user role
 * @param {number|string} userId
 * @param {'USER'|'OWNER'|'ADMIN'} role
 */
export async function updateUserRole(userId, role) {
  return apiClient.patch(`/accounts/users/${userId}/`, { role });
}

/**
 * Delete user
 * @param {number|string} userId
 */
export async function deleteUser(userId) {
return apiClient.delete(`/accounts/users/${userId}/`);
}