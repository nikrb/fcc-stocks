require( 'dotenv').config({path: '../.env'});
require( '../server/models').connect( process.env.dbUri);
const Stock = require( 'mongoose').model( 'Stock');

const fs = require( 'fs');

fs.readFile( './WIKI-datasets-codes.csv', 'utf8', (err,data) => {
  let err_count = 0;
  if( err){
    console.error( err);
  } else {
    const rows = data.split( /\r?\n/);
    rows.forEach( (row,i) => {
      const colndx = row.indexOf( ",");
      const code = row.substring( 5, colndx);
      const description = row.substring( colndx+2, row.length-1);
      // console.log( `code [${code}] description[${description}]`);
      const stk = new Stock( {code, description, is_displayed: false});
      stk.save( (err) => {
        if( err) console.error( `error inserting [${code}]:`, err);
        if( i >= rows.length-1){
          console.log( "we're done");
          process.exit();
        }
      });
    });
  }
});
