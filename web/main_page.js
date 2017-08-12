var express = require('express');
var engine = require('ejs-locals');
var app = express();
var Sequelize = require('sequelize');
var route = require('./routes/all');
//var syncDB = require(__dirname + '/sync-db');


//ejs 템플릿 엔진
app.engine('ejs', engine);
app.set('views', __dirname + '/view/main_page');
app.set('view engine', 'ejs');

//정적파일 위치
app.use(express.static( __dirname + '/static'));

//라우팅
app.use('/', route);

app.listen(3001);
module.exports = app;
