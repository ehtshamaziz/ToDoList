module.exports = {
  apps: [
    {
      name: "my-server",
      script: "app.js",
      watch: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
