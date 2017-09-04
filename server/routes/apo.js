const express = require('express');
const fetch = require('node-fetch');
const router = new express.Router();
const Stock = require( 'mongoose').model( 'Stock');

router.get('/stock', (req, res) => {
  const {code} = req.query;
  Stock.findOne( {code}, (err,stock) => {
    if( err){
      console.error( `find stock [${code}] failed:`, err);
      res.json( {action:"error", message: "stock not found", code})
    } else {
      console.log( "found stock:", stock);
      // res.json( {action:"ack", message: "found stock", stock});
      if( stock){
        const q = process.env.q_query_url+"WIKI/"+
          code+"/data.json?rows=100&api_key="+process.env.quandl_key;
        console.log( "stock request:", q);
        fetch( q)
        .then((response) => {
          // response.dataset_data
          // .column_names []
          // .start_date .end_date strings ISO date only
          // .data[
          //  [0:date, 4:close]
          // ]
          response.json().then( (result) => {
            const data = result.dataset_data.data.map( (d) => {
              return { date: d[0], close: d[4]};
            });
            res.status(200).json( {action:"stock", data});
          });
        });
      } else {
        res.json( {action:"error", message:"stock not found", code});
      }
    }
  });
  // res.status(200).json({ action: "ack", message:"fetching stock data"});
});

module.exports = router;
