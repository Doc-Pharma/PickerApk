// Native modules have no JS implementation under Jest, so the ones the app
// touches at import/render time are stubbed here.

jest.mock('react-native-device-info', () => ({
  getApplicationName: () => 'PickerApp',
  getVersion: () => '1.0.0',
  getBuildNumber: () => '1',
  getUniqueId: () => Promise.resolve('test-device-id'),
  getSystemName: () => 'Android',
  getSystemVersion: () => '14',
  getModel: () => 'Test',
}));

jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {},
}));

const firebaseInstance = () => ({
  log: jest.fn(),
  recordError: jest.fn(),
  setUserId: jest.fn(() => Promise.resolve()),
  setAttributes: jest.fn(() => Promise.resolve()),
  setCrashlyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
  logEvent: jest.fn(() => Promise.resolve()),
  logScreenView: jest.fn(() => Promise.resolve()),
  setAnalyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
});

jest.mock('@react-native-firebase/crashlytics', () => ({
  __esModule: true,
  default: firebaseInstance,
}));

jest.mock('@react-native-firebase/analytics', () => ({
  __esModule: true,
  default: firebaseInstance,
}));

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: () => ({
    getToken: jest.fn(() => Promise.resolve('test-fcm-token')),
    requestPermission: jest.fn(() => Promise.resolve(1)),
    hasPermission: jest.fn(() => Promise.resolve(1)),
    onMessage: jest.fn(() => jest.fn()),
    onNotificationOpenedApp: jest.fn(() => jest.fn()),
    onTokenRefresh: jest.fn(() => jest.fn()),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
    setBackgroundMessageHandler: jest.fn(),
  }),
  AuthorizationStatus: { AUTHORIZED: 1, PROVISIONAL: 2 },
}));

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(() => Promise.resolve('default')),
    displayNotification: jest.fn(() => Promise.resolve()),
    onForegroundEvent: jest.fn(() => jest.fn()),
    onBackgroundEvent: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve({})),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
  },
  AndroidImportance: { HIGH: 4 },
  EventType: { PRESS: 1 },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    multiRemove: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
    removeAllListeners: jest.fn(),
  })),
}));

jest.mock('react-native-vision-camera', () => ({
  Camera: () => null,
  useCameraDevice: () => null,
  useCameraDevices: () => [],
  useCameraPermission: () => ({
    hasPermission: true,
    requestPermission: jest.fn(() => Promise.resolve(true)),
  }),
}));

jest.mock('@mgcrea/vision-camera-barcode-scanner', () => ({
  useBarcodeScanner: () => ({ props: {} }),
}));

jest.mock('react-native-otp-verify', () => ({
  __esModule: true,
  default: {
    getOtp: jest.fn(() => Promise.resolve()),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  },
}));

jest.mock('react-native-worklets-core', () => ({
  useRunOnJS: fn => fn,
  useSharedValue: initial => ({ value: initial }),
  Worklets: { createRunOnJS: fn => fn },
}));

jest.mock('react-native-worklets', () => ({
  useRunOnJS: fn => fn,
}));
