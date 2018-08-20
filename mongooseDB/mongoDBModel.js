var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var companiesSchema = new Schema({
  companyName: String,
  description: String,
  address: String,
  city: String,
  state: String,
  zip: Number,
  country: String,
  latitude: String,
  longitude: String,
  website: String,
  firstName: String,
  lastName: String,
  email: String
});

module.exports = mongoose.model("companies", companiesSchema);
