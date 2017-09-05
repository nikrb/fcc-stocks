const url = require( 'url');
const Stock = require( 'mongoose').model( 'Stock');
let all = new Set();
exports.add = ( sock, req) => {
  all.add( sock);

  const location = url.parse( req.url, true);
  // console.log( "connection request:", req);
  all.add( sock);
  sock.on( 'message', ( message) => {
    console.log( "received [%s]", message);
    const msg = JSON.parse( message);
    // sock.send( `echo message[${message}]`);
    switch( msg.action){
      case 'show':
        Stock.find( {is_displayed: true}, (err, stocks) => {
          console.log( "stocks displayed:", stocks);
          if( err){
            console.err( "find displayed stocks failed:", err);
            sock.send( JSON.stringify( {action: "show", error: "stocks not found"}));
          } else {
            stocks.forEach( (stock) => {
              sock.send( JSON.stringify( {action: "add", stock}));
            });
          }
        });
        break;
      case 'add':
        Stock.findOne({code: msg.code}, (err, stock) => {
          if( err){
            console.error( `find stock [${msg.code}] failed:`, err);
            sock.send( JSON.stringify( {action:"error", message:"stock not found"}));
          } else {
            if( stock){
              stock.is_displayed = true;
              stock.save( function( err){
                if( err) console.error( "stock save failed:", err);
              });
              all.forEach( (s) => {
                s.send( JSON.stringify({ action:"add", stock}));
              });
            } else {
              sock.send( JSON.stringify( {action:"error", message:"stock not found"}));
            }
          }
        });
        break;
      case 'remove':
        Stock.findOne( {code:msg.code}, (err, stock) => {
          if( err) console.error( "remove find stock failed:", err);
          if( stock){
            stock.is_displayed = false;
            stock.save();
            all.forEach( (s) => {
              s.send( JSON.stringify( {action:"remove", code: msg.code}));
            });
          } else {
            sock.send( JSON.stringify( {action:"error", message: "stock not found"}));
          }
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
