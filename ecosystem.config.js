module.exports = {
  apps: [
    {
      name: 'sivakasi-green-forum',
      script: './backend/backend/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
  ],
};
