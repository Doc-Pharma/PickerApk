import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';

export const ENV = {
  API_URL: Config.API_BASE_URL,
  TIMEOUT: parseInt(Config.API_TIMEOUT || '10000', 10),
  APP_NAME: DeviceInfo.getApplicationName(), // from build.gradle productFlavors resValue
  IS_DEV: Config.APP_ENV !== 'production',
  MOCK_MODE: false,
  ONE_APP_URL: Config.ONE_APP_URL || 'https://one.dev.docpharma.in',
};
