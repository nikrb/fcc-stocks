const mongoose = require( 'mongoose');

const StockSchema = new mongoose.Schema({
  code: {
    type: String,
    index: { unique: true}
  },
  description: String
});

module.exports = mongoose.model('Stock', StockSchema);
