module.exports = {
  apps: [{
    name: "iamla",
    script: "./src/server.js",
    env_production: {
      NODE_ENV: "production",
      PORT: 8100
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}; 