module.exports = {
  apps: [{
    name: 'expense-tracker-backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    // Auto-restart on crashes
    restart_delay: 4000,
    min_uptime: '10s',
    max_restarts: 10,
    // Health check
    health_check_http_url: 'http://localhost:5000/ping',
    health_check_grace_period: 3000,
    health_check_interval: 30000
  }]
};
