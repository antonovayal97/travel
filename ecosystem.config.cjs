/** PM2 production config — run from project root: pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: 'travel',
      cwd: __dirname,
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3101,
        NEXT_PUBLIC_SERVER_URL: 'https://travel.aial-antonov.online',
      },
    },
  ],
}
