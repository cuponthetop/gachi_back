var express = require('express');
var engine = require('ejs-locals');
var app = express();

app.engine('ejs', engine);
app.set('views', __dirname + '/view/main_page');
app.set('view engine', 'ejs');

app.use(express.static( __dirname + '/static'));
app.get('/', function(req, res){
  res.render('main_page');
});

app.listen(3030);
