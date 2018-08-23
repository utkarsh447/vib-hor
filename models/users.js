var db = require("./database.js");

var users_model = db.Model.extend({
  tableName: "users",
  idAttribute: "id"

});

var users = db.Collection.extend({
  model: users_model
});

module.exports = {
  users_model: db.model("users_model", users_model),
  users: db.collection("users", users)
};
