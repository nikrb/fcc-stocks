const express = require('express');
const httpServer = require( 'http');
const WebSocket = require( 'ws');
const bodyParser = require('body-parser');
if( process.env.NODE_ENV !== 'production'){
  require( 'dotenv').config();
}
require( './models').connect( process.env.dbUri);
const app = express();
const connections = require( './models/Connections');

const PORT = process.env.PORT || 5000;

// app.set('port', 5000);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use( '/', express.static('client/build'));

  app.get('/', function (req, res) {
    res.sendFile( 'client/build/index.html');
  });
}

app.use( bodyParser.json());

const apoRoutes = require( './routes/apo');
app.use( '/apo', apoRoutes);

const server = httpServer.createServer( app);

server.listen(PORT, function () {
  console.log(`Listening on port [${PORT}]`);
});

const ws = new WebSocket.Server({server});
ws.on( 'connection', (sock, req) => {
  connections.add( sock, req);
});
