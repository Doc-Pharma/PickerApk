module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      // Jest config/setup run in Node with the Jest globals available.
      files: ['jest.setup.js', 'jest.config.js', '__tests__/**'],
      env: { jest: true, node: true },
    },
  ],
};
