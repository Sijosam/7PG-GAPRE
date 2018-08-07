const express               = require('express');
const bodyParser            = require("body-parser");
const hbs                   = require('hbs');
const moment                = require('moment');
const expressSanitizer      = require('express-sanitizer');
const passport              = require("passport");
const LocalStrategy         = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const mw                    =require("./middleware/index.js");

const mongoose              = require('mongoose');
const Report                = require('./models/report.js');
const Admin                = require('./models/Admin.js');



var {ObjectID} = require('mongodb');
var app = express();

app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});



hbs.registerPartials(__dirname + '/views/partials');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.set('view engine', 'hbs');
app.use(require("express-session")({
    secret: "Keep safe be Safe",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());







mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/7PG');


hbs.registerHelper('getdate', (date) => {

    return moment(date).format('LLLL');

});



//Admin Login


app.get('/adminreg',(req,res) => {
  res.render('register');
})

app.get('/adminAll',mw.isLoggedIn,(req,res) => {
  Report.find({}, (err,reportt) => {
  res.render("adminAll",{report:reportt});
});
})



app.post('/adminreg',mw.isLoggedIn, (req,res) => {
  Admin.register(new Admin({username: req.body.username}), req.body.password, (err, user) => {
      if(err){
          console.log(err);
          return res.render('register');
      }
      passport.authenticate("local")(req, res, () => {
        //   Report.find({}, (err,reportt) => {
          res.redirect("/adminAll");
        // });
      });
  });
});


// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("login");
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/adminAll",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});








// mAIN Page
app.get('/', (req,res) => {
Report.find({}, (err,reportt) => {
  res.render("welcome",{report:reportt});
});

});

//Rendering new template
app.get('/new', (req,res) => {
  res.render("new");
})


//create
app.post("/report",mw.geocoded,(req,res) => {


     var report = {
       location : {
         lat : req.sanitize(req.body.location.location[0].lat),
         lng : req.sanitize(req.body.location.location[0].long),
       },

       description : req.sanitize(req.body.description),
       type : req.sanitize(req.body.type),
       image :req.body.image.image[0],
       userID:req.sanitize(req.body.userId),
       place:req.sanitize(req.place)
     }

     console.log(report);

    Report.create(report, function(err,newreport){
        if(err)
            {
            res.status(404).send("Unable to connect");
            }
            else
            {
            res.status(200).send("Reporting has been completed");
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

app.get("/edit/:id",mw.isLoggedIn, (req,res) => {
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
app.post("/edit/:id",mw.isLoggedIn, (req,res) => {

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
app.post("/del/:type/:id",mw.isLoggedIn, (req, res) => {
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


app.get('/user/:id', (req,res) => {
  var id = req.params.id;
Report.find({"userID": id}, (err,reportt) => {
  res.send({report:reportt});
});

});




app.listen(3000, () => {
  console.log('Started the Server 3000');
});
