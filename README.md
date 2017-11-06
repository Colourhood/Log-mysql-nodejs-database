[![Waffle.io - Columns and their card count](https://badge.waffle.io/Colourhood/Log-mysql-nodejs-database.svg?columns=all)](https://waffle.io/Colourhood/Log-mysql-nodejs-database) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Colourhood/Log-mysql-nodejs-database/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Colourhood/Log-mysql-nodejs-database/?branch=master)

# Log-mysql-nodejs-database
The database logic that is used for the 'Log Messenger App.'

# Motivation
I was motivated to start this project beacuse I wanted to step out of my comfort zone with mobile app development and create a server app with support for a database.

# Getting Started
**Pre-requisites**

Install [NodeJS](https://nodejs.org/en/download/)

Install MySQL

**Recommended**

Install [SequelPro](https://www.sequelpro.com)

Install [Nodemon](https://github.com/remy/nodemon) - globally

# Setting Up The Project

**Download the repository from GitHub**

```https://github.com/Colourhood/Log-mysql-nodejs-database.git```

**Install packages for the project**

```npm install```

**AWS SDK Credentials - Required to run project**

*Note*: These is very sensitive information that cannot and should not be shared due to security reasons, just like your SS#; do not share.

**Get Keys** You must request and submit permissions from the REPO Owner in order to obtain the appropriate credentials to connect to the AWS SDK. Contact andrei@colourhood.org for more information.

**Setting up keys (if provided)**

```mkdir ~/.aws && cd ~/.aws && touch credentials.json && cat >> credentials.json [press enter; then paste the keys into the file; press enter; then press Control-D]```

We will creating a diretory called .aws in the users root directory and storing the AWS keys within a file called credentials.json

# Running The App/Server

There are two ways of running the server.

Method #1 - run ```node .``` same as ```node index.js```

Method #2 - run ```nodemon .``` same as ```nodemon index.js```

*I recommend the latter as nodemon will listen to any changes done to the codebase and run the server automatically.*

# Coding Style

For this project we are using ESLint (by AirBnB) to style our code.

To analyze all files run ```eslint .``` or ```eslint index.js```


