module.exports = {
    apps : [{
      name        : "elasticsearch",
      script      : "elasticsearch.js",
      cwd         : "/var/api/elastic/elasticsearch",
      args        : "production",
      watch       : false,
      ignore_watch: ['tmp', 'tmp/*', 'db', 'db/*', 'node_modules', 'node_modules/*'],
      env: {
        "NODE_ENV": "development",
      },
      env_production : {
         "NODE_ENV": "production"
      }
    }]
}