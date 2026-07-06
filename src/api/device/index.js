import { request } from '../client';

/**
 * Register or update the device FCM token on the backend.
 * Call after login and on token refresh.
 */
export const registerFcmToken = token =>
  request('POST', '/app/device/register-token', { fcmToken: token });
