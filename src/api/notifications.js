import apiClient from './client';

// Tell the bell badge in AppLayout to re-count after something changes.
export const NOTIFICATIONS_CHANGED = 'notifications-changed';
const changed = () => window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));

/** Newest first, at most 100. */
export async function listNotifications({ unreadOnly = false } = {}) {
    return apiClient.get('/notifications/', unreadOnly ? { params: { unread: 'true' } } : undefined);
}

/** @returns {Promise<number>} */
export async function getUnreadCount() {
    const { count } = await apiClient.get('/notifications/unread-count/');
    return count;
}

export async function markRead(id) {
    const result = await apiClient.post(`/notifications/${id}/read/`);
    changed();
    return result;
}

export async function markAllRead() {
    const result = await apiClient.post('/notifications/read-all/');
    changed();
    return result;
}

export async function dismiss(id) {
    await apiClient.delete(`/notifications/${id}/`);
    changed();
}
