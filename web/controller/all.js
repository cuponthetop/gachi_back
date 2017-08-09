var request = require('request');

const index = function(req, res){
 res.render('main_page');
};

const search = function(req, res){
  var term=req.query.term;

  res.render('search',{term: term});
}

module.exports = {
  index,
  search,
}
