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
    rows.forEach( (row) => {
      const colndx = row.indexOf( ",");
      const code = row.substring( 5, colndx);
      const description = row.substring( colndx+2, row.length-1);
      console.log( `code [${code}] description[${description}]`);
      const stk = new Stock( {code, description});
      stk.save( (err) => {
        // console.error( `error inserting [${code}]:`, err);
        err_count++;
      });
    });
  }
  console.log( "finished, error count:", err_count);
  process.exit(1);
});
