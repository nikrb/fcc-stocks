const url = require( 'url');
let all = new Set();
exports.add = ( sock, req) => {
  all.add( sock);

  const location = url.parse( req.url, true);
  // console.log( "connection request:", req);
  all.add( sock);
  sock.on( 'message', ( message) => {
    // console.log( "received [%s]", message);
    const msg = JSON.parse( message);
    // sock.send( `echo message[${message}]`);
    switch( msg.action){
      case 'add':
        all.forEach( (s) => {
          s.send( JSON.stringify({ action:"add", code:msg.code}));
        });
        break;
      default:
        console.error( "message action unrecognised:", msg);
        break;
    }
  });
  sock.on( 'close', () => {
    all.delete(sock);
  });
  sock.send( JSON.stringify( { success: true, message: "connected"}));
};
