module.exports = {
    apps: [{
      name: 'Log-server',
      script: './index.js'
    }],
    deploy: {
      production: {
        user: 'colourhood',
        host: 'ec2-52-14-241-17.us-east-2.compute.amazonaws.com',
        key: '~/.ssh/id_rsa',
        ref: 'origin/master',
        repo: 'git@github.com:Colourhood/Log-mysql-nodejs-database.git',
        path: '/home/colourhood/COLOURHOOD',
        'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
      }
    }
  }