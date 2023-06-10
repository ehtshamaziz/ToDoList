module.exports = {
  apps: [
    {
      name: "my-server",
      script: "server.js",
      watch: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
