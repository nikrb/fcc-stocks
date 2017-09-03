const express = require('express');

const router = new express.Router();

router.get('/someroute', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this data."
  });
});

module.exports = router;
