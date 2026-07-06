import { PermissionsAndroid, Platform } from 'react-native';

// Returns true if notification permission is granted.
// POST_NOTIFICATIONS is only required on Android 13+ (API 33+).
// shouldRequest=false → only check, don't prompt the user.
export const requestNotificationPermission = async (shouldRequest = true) => {
  try {
    if (Platform.OS !== 'android') return true;
    if (Platform.Version < 33) return true;

    const already = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (already) return true;
    if (!shouldRequest) return false;

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};
