const express = require('express');
const bodyParser  = require("body-parser");
const hbs = require('hbs');
const moment = require('moment');


var {ObjectID} = require('mongodb');
var app = express();

app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});


hbs.registerPartials(__dirname + '/views/partials');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'hbs');

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/7PG');

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

var Report = mongoose.model("Report", reportSchema);



  // Report.create(
  //    {
  //        userID: '1PID',
  //        type:'G',
  //        name: "Pipeline",
  //        image: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/201506/croc-story_647_061915020003.jpg",
  //        description: "Extremly dangerous for Env",
  //        date:  new Date().toString(),
  //        location:{
  //          lat:1.232434534,
  //          lng:.08797657547
  //        }
  //     },(err,report) => {
  //       if(err){
  //         console.log(err)
  //       }else{
  //         console.log("Reporting Has Been completed");
  //       }
  //     }
  //   );




// mAIN Page
app.get('/', (req,res) => {

        res.render("welcome");
});

//Rendering new template
app.get('/new', (req,res) => {
  res.render("new");
})


//create
app.post("/report", (req,res) => {

    Report.create(req.body.report, function(err,newreport){
        if(err)
            {
            res.render("new");
            }
            else
            {
            res.render("welcome");
            }
    });
});







//show PotHoles Page
app.get('/potholes', (req,res) => {
  Report.find({'type' : "P"}, (err,pReport) => {
    if(err){
      console.log("Errorr");
    }else {
        //var date = moment(pReport.date).format('LLLL');
      res.render("pothole",{p_report:pReport});
    }
  });
});

app.post("/potholes/:id", (req, res) => {
   Report.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("potholes");
      } else {
          res.render("welcome");
      }
   });
});

//Show garbage Page
app.get('/garbage', (req,res) => {
  Report.find({'type':'G'}, (err,gReport) => {
    if(err){
      console.log("Errorr");
    }else {

      res.render("garbage",{g_report:gReport});
    }
  });
});
//Delete
app.post("/garbage/:id", (req, res) => {
   Report.findByIdAndRemove(req.params.id, (err) => {
      if(err){
          res.redirect("potholes");
      } else {
          res.render("welcome");
      }
   });
});

//Sending listens to the FrontEnd code
app.get('/garbage/get', (req,res) => {
  Report.find({'type':'G'}, (err,gReport) => {
    if(err){
      console.log("Errorr");
    }else {

      res.send({g_report:gReport});
    }
  });
});




app.listen(3000, () => {
  console.log('Started the Server');
});
