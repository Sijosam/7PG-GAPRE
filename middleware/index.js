

module.exports = {
    geocoded: function(req, res, next){
       geocoder.reverseGeocode(req.body.location.location[0].lat,req.body.location.location[0].long,( err, data ) => {
         req.place = data.results[0]. formatted_address;
            next();
          });
        }
    }

// geocoder.reverseGeocode(req.body.location.location[0].lat,req.body.location.location[0].long,( err, data ) => {
//   var place = data.results[0]. formatted_address;
