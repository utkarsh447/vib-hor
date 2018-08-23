var db = require("./database.js");

var search_model = db.Model.extend({
  tableName: "Search",
  idAttribute: "id"

});

var search = db.Collection.extend({
  model: search_model
});

module.exports = {
  search_model: db.model("search_model", search_model),
  search: db.collection("Search", search)
};
