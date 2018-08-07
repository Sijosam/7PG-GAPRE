const geocoder = require('geocoder');



geocoder.reverseGeocode( 10.0164249, 76.3377045, function ( err, data ) {
  if(err){
    console.log(err);
  }else{
    var t = data.results[2].formatted_address;
    console.log(t);
  }
});
