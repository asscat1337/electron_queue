module.exports = {
  apps : [{
    name: "app",
    script: "./server.js",
    env: {
      NODE_ENV: "development",
      port:8081
    },
    env_production: {
      NODE_ENV: "production",
      port:8080
    }
  }]
}