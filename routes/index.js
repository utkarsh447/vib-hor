var express = require('express');
var app = express();

app.get("/", function(req, res){
	var message = '';
 		res.redirect("/users/log");
})

module.exports = app;
