const mongoose = require( 'mongoose');

const PriceSchema = new mongoose.Schema({
  code: {
    type: String,
    index: { unique: true}
  },
  date: Date,
  close: Number
});

module.exports = mongoose.model('Price', PriceSchema);
