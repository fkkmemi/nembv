const cfg = require('./cfg/cfg');

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'nembv',
      script    : 'bin/www',
      // watch: ["bin","routes","views","system"],
      ignore_watch : ["node_modules","cfg"],
      watch_options: {
          "followSymlinks": false
      },
      max_memory_restart : "2G",
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : cfg.pm2.user,
      host : [
          {
              "host": cfg.pm2.host,
              "port": cfg.pm2.port,
          }
        ],
      ref  : 'origin/master',
      repo : 'git@github.com:fkkmemi/nembv.git',
      path : cfg.pm2.path,
        // 'post-deploy' : 'npm install && pm2 startOrRestart ecosystem.config.js --env production'
      'post-deploy' : 'npm install && cd fe && npm install && npm run build && cd .. && pm2 startOrRestart ecosystem.config.js --env production'
    },
    dev : {
      user : cfg.pm2.user,
      host : [
        {
          "host": cfg.pm2.host,
          "port": cfg.pm2.port,
        }
      ],
      ref  : 'origin/master',
      repo : 'git@github.com:fkkmemi/nembv.git',
      path : cfg.pm2.path,
      'post-deploy' : 'npm install && cd fe && npm install && npm run build && cd .. && pm2 startOrRestart ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
