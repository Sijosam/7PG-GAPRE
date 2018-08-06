var mongoose = require('mongoose');
// SCHEMA SETUP
var reportSchema = new mongoose.Schema({
   userID:String,
   type:String,
   place: String,
   image: String,
   description: String,
   location:{
     lat:Number,
     lng:Number
   },
    date    : {
      type:Date,
      default:Date.now
    }
});

module.exports = mongoose.model("Report", reportSchema);
