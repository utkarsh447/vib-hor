var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var validator = require("email-validator");
var axios = require('axios');
var app = express.Router();

var User = require("../models/users").users_model;
var Search = require("../models/Search").search_model;

var secret = "Vibhor";

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    // Next middleware
    next();
  } else {
    // Forbidden
      res.sendStatus(403);

  }

}
app.post("/register", function(req, res){
   message = '';
   var name= req.body.username;
   var email= req.body.email;
   var pass = req.body.password;

   User.forge({
        username: name,
        password: pass,
        email: email
    }, {method: "insert"})
      .save()
      .then(function(response){
        var response1 = response.toJSON();
        console.log(response1.id);
        res.send({
          "Created UserID": response1.id
        })
      }).catch(function(reason){
          res.send(reason);

      })
});

app.get("/login", function(req, res){
  res.send({
    Platform: "Backend API Endpoint Working."
  })
})

app.post("/login", function(req, res){
   var email= req.body.email;
   var pass = req.body.password;

   User.where({
      email: email,
      password: pass
   })
    .fetch()
    .then(function(user){
       if(user===null){
          message = 'Wrong Credentials.';
          console.log(message);
          res.send({message: message});
       }
       else{
          user1 = user.toJSON();
          var user = {
            id: user1.id,
            email: user1.email,
            username: user1.username
          }
          console.log("userid: " + user1.id);

          jwt.sign({user}, secret, { expiresIn: '24h' }, (err, token) => {
            console.log(token);
            res.json({
              token
            });
          });
       }
    })
    .catch(function (error) {
      console.error(error);
    })
});


app.get("/profile",verifyToken, function(req, res){
   // var userId = req.session.userId;
   jwt.verify(req.token, secret, (err, authData) => {
       if(err) {
         res.sendStatus(403);
       } else {
         User.where({
           id: authData.user.id
         })
         .fetch()
         .then(function(data){
           console.log(data.toJSON())
           var data1 = data.toJSON();
           res.json({
             message: 'Token Data',
             data1
           });
         })
       }
     });
})

app.post("/wordsearch", verifyToken, function(req, res){
  var word = req.body.wordsearch;
  jwt.verify(req.token, secret, (err, authData) => {
       if(err) {
         res.sendStatus(403);
       } else {
         // console.log(word);
         axios.get('https://api.github.com/search/repositories', {
            params: {
              ID: 12345,
              q: word,
              sort:'stars',
              order:'desc',
              page: 1,
              per_page: 5
            }
          })
          .then(function (response) {
            res.send(response.data.items);
            console.log(authData.user);
            Search.forge({
                word: word,
                email: authData.user.email
            }, {method: "insert"})
              .save()
              .then(function(response){
                console.log("Created WordID: "+ response.id)
              })
              .catch(function(reason){
                  console.error(reason);

              })

          })
          .catch(function (error) {
            console.error(error);
          }) 
       }
     });
})

module.exports = app;
