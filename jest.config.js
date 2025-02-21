module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  verbose: true,
  setupFiles: ['dotenv/config']
}; 