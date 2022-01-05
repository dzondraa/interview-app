module.exports = {
    apps : [{
      name        : "ignite",
      script      : "./server.js",
      args        : "production",
      watch       : true,
      ignore_watch: ['tmp', 'tmp/*', 'db', 'db/*', 'node_modules', 'node_modules/*'],
      env: {
        "NODE_ENV": "development",
      },
      env_production : {
         "NODE_ENV": "production"
      }
    }]
}