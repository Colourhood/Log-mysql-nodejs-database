require('app-module-path').addPath(__dirname);

const bodyParser = require('body-parser'),
      routes = require('routes'),
      app = require('express')()
      server = require('http').Server(app),
      socketio = require('socket.io')(server);

app.use(bodyParser.json({ limit: '2mb' }));
app.use('/api', routes);
app.io = socketio;

app.get('/', (request, response) => {
    response.status(200).json({ Home: 'Colourhood presents the log database project' });
});

server.listen(7555, () => {
    console.log('Server running on port 7555');
});