const express = require('express');
const fetch = require('node-fetch');
const router = new express.Router();

router.get('/stock', (req, res) => {
  const {code} = req.query;
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
  // res.status(200).json({ action: "ack", message:"fetching stock data"});
});

module.exports = router;
