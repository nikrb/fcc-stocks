const express = require('express');
const httpServer = require( 'http');
const url = require( 'url');
const WebSocket = require( 'ws');
const bodyParser = require('body-parser');
const passport = require( 'passport');
require( 'dotenv').config();
require( './models').connect( process.env.dbUri);
const app = express();

// cloud9 requires port 8080
// react-scripts start dev server on 3000 so we can have the backend api at 8080
// for production we can run single server on 8080 and serve react bundle
app.set('port', (process.env.port || 8080));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use( '/', express.static('client/build'));

  app.get('/', function (req, res) {
    res.sendFile( 'client/build/index.html');
  });
}

app.use( bodyParser.json());
app.use( passport.initialize());

const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

const server = httpServer.createServer( app);
const ws = new WebSocket.Server({server});
ws.on( 'connection', (sock, req) => {
  const location = url.parse( req.url, true);

  sock.on( 'message', ( message) => {
    console.log( "received [%s]", message);
    sock.send( `echo message[${message}]`);
  });
  sock.send( 'sock connected');
});

// app.listen(app.get('port'), () => {
//   console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
// });

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port);
});
