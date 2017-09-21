require('app-module-path').addPath(__dirname);
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('routes');
const app = express();

app.use(bodyParser.json({ limit: '2mb' }));
app.use('/api', routes);

app.get('/', (request, response) => {
    response.status(200).json({ Home: 'Colourhood presents the log database project' });
});

http.createServer(app).listen(7555, () => {
    console.log('Server running on http://localhost:7555');
});