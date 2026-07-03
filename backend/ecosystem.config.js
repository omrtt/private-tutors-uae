module.exports = {
  apps: [{
    name: 'private-tutors-uae',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
    },
    error_file: '/tmp/private-tutors-logs/error.log',
    out_file: '/tmp/private-tutors-logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '500M',
  }],
};