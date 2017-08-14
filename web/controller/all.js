var request = require('request');
var http  = require('http');
var moment = require('moment');

var index_data;

var festData = function(callback){
  var options = {
      url: 'http://cuponthetop.com/gachi/api/v1/festival/list?page=1&type=default',
      method: 'GET',
  };
  request(options, function(err, res, body) {
      index_data = JSON.parse(res.body);
      //index_data = res.body;
      callback();
  });
}

var index = function(req, res){
 festData(function() {
   res.render('main_page',{'festival':index_data, moment:moment});
 });
};

const search = function(req, res){
  var term=req.query.term;

  res.render('../search/search',{term: term});
};

const login = function(req, res){
 res.render('../login/login');
};

const signup = function(req, res){
 res.render('../signup/signup');
};

const info_slide = function(req, res){
  res.render('../info_slide/info_slide');
}

var detail_data;
var fid="";

var detailData = function(callback){
  var options = {
      url: 'http://cuponthetop.com/gachi/api/v1/festival/'+fid,
      method: 'GET',
  };
  request(options, function(err, res, body) {
      index_data = JSON.parse(res.body);
      callback();
  });
}

const detail = function(req, res){
  fid = req.params.fid;

  detailData(function() {
    res.render('../detail/detail',{fid: fid});
  });
};



module.exports = {
  index,
  search,
  login,
  signup,
  info_slide,
  detail,
}
