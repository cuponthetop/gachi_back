var express = require('express');
var engine = require('ejs-locals');
var app = express();
var Sequelize = require('sequelize');

const syncDB = require(__dirname + '/sync-db')

//ejs 템플릿 엔진
app.engine('ejs', engine);
app.set('views', __dirname + '/view/main_page');
app.set('view engine', 'ejs');

//정적파일 위치
app.use(express.static( __dirname + '/static'));

/*
syncDB.then(_=> {
  console.log('sync database');
})
*/
//라우팅및 서버실행
app.get('/', function(req, res){
  res.render('main_page');
});
app.listen(3030);
