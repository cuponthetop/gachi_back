var request = require('request');
var http = require('http');

var index = function (req, res) {
  res.render('main_page');
};

const search = function (req, res) {
  var term = req.query.term || '';

  res.render('../search/search', { term: term });
};

const login = function (req, res) {
  res.render('../login/login');
};

const signup = function (req, res) {
  res.render('../signup/signup');
};

const info_slide = function (req, res) {
  res.render('../info_slide/info_slide');
}

const detail = function (req, res) {
  var fid = req.params.fid;

  res.render('../detail/detail', { 'fid': fid });
};

const chatList = function (req, res) {
  res.render('../chat/list');
};

const chatRoom = function (req, res) {
  var lid = req.params.lid;

  res.render('../chat/chatroom', { lid });
};

const createChatRoom = function (req, res) {
  var fid = req.params.fid;

  res.render('../chat/create', { fid });
};

const chatInfo = function (req, res) {
  var lid = req.params.lid;

  res.render('../chat/info', { lid });
};

module.exports = {
  index,
  search,
  login,
  signup,
  info_slide,
  detail,
  chatList,
  chatRoom,
  createChatRoom,
  chatInfo,
}
