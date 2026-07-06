import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { request } from '../client';

/**
 * Check for app update
 * GET /app-version/check?platform=android&version_code=3
 */
export const checkAppVersion = () => {
  const platform = Platform.OS;
  const version_code = DeviceInfo.getBuildNumber();
  return request('GET', '/app-version/check', null, { platform, version_code });
};
