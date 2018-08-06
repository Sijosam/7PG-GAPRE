const geocoder = require('geocoder');



geocoder.reverseGeocode( 33.7489, -84.3789, function ( err, data ) {
  if(err){
    console.log(err);
  }else{
    var t = data.results[0]. formatted_address;
    console.log(t);
  }
});
