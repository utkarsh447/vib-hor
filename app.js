/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//var methodOverride = require('method-override');
var session = require('express-session');
var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");

// var VerifyToken = require("./routes/VerifyToken");

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){
   res.redirect("/login");
})

app.use("/", user);

//Middleware
var PORT = process.env.PORT || 8000
app.listen(PORT, function(req, res){
  console.log("Listening at 8000");
})

module.exports = app;
