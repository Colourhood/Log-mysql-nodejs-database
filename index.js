const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');
const app = express();

// app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api', routes);
// app.use((request, response, next) => {
//     response.header('content-type', 'application/json');
//     next();
// });

app.get('/', (request, response) => {
    response.status(200).json({ Home: 'Colourhood presents the log database project' });
});

http.createServer(app).listen(7555, () => {
    console.log('Server running on http://localhost:7555');
});