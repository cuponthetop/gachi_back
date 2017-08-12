var request = require('request');

const index = function(req, res){
 res.render('main_page');
};

const search = function(req, res){
  var term=req.query.term;

  res.render('../search/search',{term: term});
}

const login = function(req, res){
 res.render('../login/login');
};

const signup = function(req, res){
 res.render('../signup/signup');
};

module.exports = {
  index,
  search,
  login,
  signup,
}
