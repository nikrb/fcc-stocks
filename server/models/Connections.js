const url = require( 'url');
const Stock = require( 'mongoose').model( 'Stock');
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
        Stock.findOne({code: msg.code}, (err, stock) => {
          if( err){
            console.error( `find stock [${msg.code}] failed:`, err);
            sock.send( JSON.stringify( {action:"error", message:"stock not found"}));
          } else {
            all.forEach( (s) => {
              s.send( JSON.stringify({ action:"add", stock}));
            });
          }
        });
        break;
      case 'remove':
        all.forEach( (s) => {
          s.send( JSON.stringify( {action:"remove", code: msg.code}));
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
  sock.send( JSON.stringify( { action: "ack", message: "connected"}));
};
