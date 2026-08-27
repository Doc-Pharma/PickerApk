module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // These ship untranspiled ESM, so they have to go through Babel rather
  // than being ignored along with the rest of node_modules.
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?(' +
      '@react-native|react-native|@react-navigation|' +
      'react-native-toast-message|react-native-svg|react-native-qrcode-svg|' +
      'react-native-safe-area-context|react-native-screens|' +
      'react-native-reanimated|react-native-worklets|react-native-worklets-core|' +
      '@mgcrea/vision-camera-barcode-scanner|react-native-vision-camera' +
      ')/)',
  ],
};
