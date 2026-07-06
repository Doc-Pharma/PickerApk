import { Camera } from 'react-native-vision-camera';

// Returns true if camera permission is granted.
// shouldRequest=false → only check, don't prompt the user.
export const requestCameraPermission = async (shouldRequest = true) => {
  try {
    const status = await Camera.getCameraPermissionStatus();
    if (status === 'granted') return true;
    if (!shouldRequest) return false;
    const result = await Camera.requestCameraPermission();
    return result === 'granted';
  } catch {
    return false;
  }
};
