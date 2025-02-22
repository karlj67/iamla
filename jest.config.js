module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|ts)$': ['babel-jest', { configFile: './.babelrc' }]
  },
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  verbose: true,
  setupFiles: ['dotenv/config'],
  moduleDirectories: ['node_modules', 'src'],
  testEnvironmentOptions: {
    NODE_OPTIONS: '--experimental-vm-modules'
  }
}; 