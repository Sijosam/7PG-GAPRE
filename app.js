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

hbs.registerHelper('getdate', (date) => {

    return moment(date).format('LLLL');

});



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
app.get('/type/:type', (req,res) => {
  var type = req.params.type;
  Report.find({'type' : type}, (err,Report) => {
    if(type === 'P'){
        res.render("pothole",{report:Report});
    }
    else if(type === 'G'){
      res.render("garbage",{report:Report});
    }else{
        res.status(404).send("Error");
    }
  });
});


//EDIT ROUTE

app.get("/edit/:id", (req,res) => {
    Report.findById(req.params.id, function(err, found){
       if(err)
            {
            res.render("welcome");
            }
            else
            {
            res.render("edit", {found : found});
            }
    });
});

//update
app.post("/edit/:id", (req,res) => {

      Report.findByIdAndUpdate(req.params.id,req.body.report, function(err, updatedBlog){
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



//Delete PotHoles
app.post("/del/:type/:id", (req, res) => {
   Report.findByIdAndRemove(req.params.id, function(err){
    var type = req.params.type;
     if(type === 'P'){
         res.render("pothole");
     }
     else if(type === 'G'){
       res.render("garbage");
     }else{
         res.status(404).send("Error");
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
